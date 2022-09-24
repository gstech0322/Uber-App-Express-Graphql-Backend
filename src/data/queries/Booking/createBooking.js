import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull
} from 'graphql';
import {
    Booking,
    BookingHistory,
    User,
    UserProfile,
    Vehicles,
    PromoCode,
    BookingPromoCode,
    Location,
    Pricing,
    Category,
    CurrencyRates
} from '../../models';
import sequelize from '../../../data/sequelize';
import BookingRequestType from '../../types/BookingRequestType';
import { distance as maxDistance } from '../../../config';
import calculateTripCalculation from '../../../libs/calculateTripCalculation';
import {
    getUserLoginData,
    checkRiderActiveBooking
} from '../../../helpers/booking/bookingHelpers';
import { sendNotifications } from '../../../helpers/push-notification/sendNotifications';

const userModelColumn = ['profileId', 'userId', 'firstName', 'lastName', 'picture',
    'preferredCurrency', 'preferredPaymentMethod'
];

const createBooking = {

    type: BookingRequestType,

    args: {
        data: { type: StringType },
        requestStatus: { type: new NonNull(StringType) },
    },

    async resolve({ request }, { requestStatus, data }) {
        let userId, pickUpLat, pickUpLng, category;
        let bookingId, requestData, restrictDeclinedDrivers;
        let driverId, convertCurrency, tripCalculation, totalDistance;
        let deviceId, deviceType, totalDuration, vehicleData, vehicleId, vehicleNumber, vehicleModel, vehicleColor;
        let pushNotificationContent, promoId, promoCodeData;
        let isSpecialTrip, specialTripPrice, specialTripTotalFare;
        let requestLang;

        // Geo-Fencing
        let requestLocationPoint, contains, permittedLocationsId;
        let pricingAttributes = [
            'id', 'categoryId', 'unitPrice', 'minutePrice', 'basePrice', 'currency', 'riderFeeType',
            'riderFeeValue', 'driverFeeType', 'driverFeeValue', 'isActive', 'isSurgePrice'
        ];
        let rates = {}, baseCurrency;

        try {
            requestData = JSON.parse(data);

            if (requestStatus && requestData) {
                userId = requestData.userId;
                pickUpLat = requestData.pickUpLat;
                pickUpLng = requestData.pickUpLng;
                category = requestData.category;
                totalDistance = requestData.rideDistance;
                deviceId = requestData.deviceId;
                deviceType = requestData.deviceType;
                totalDuration = requestData.rideDuration ? requestData.rideDuration : 0;
                promoId = requestData.promoId;

                // User Login - Current Device
                const userLoginData = await getUserLoginData(userId, deviceId, deviceType);

                if (userLoginData) { // Check current request with logged-in user device
                    const { status, errorMessage } = await checkRiderActiveBooking(userId, new Date());

                    if (status !== 200) {
                        return {
                            status,
                            errorMessage
                        };
                    }

                    requestLocationPoint = sequelize.fn('GeomFromText', `POINT(${pickUpLat} ${pickUpLng})`);

                    contains = sequelize.fn('ST_CONTAINS',
                        sequelize.col(`geometryCoordinates`),
                        requestLocationPoint
                    );

                    const permittedLocations = await Location.findAll({
                        attributes: ['id'],
                        where: {
                            isActive: true,
                            and: sequelize.where(contains, 1)
                        },
                        raw: true
                    });

                    if (permittedLocations && permittedLocations.length > 0) {
                        permittedLocationsId = permittedLocations.map(x => { return x['id'] });
                        // Find the pricing for the allowed location with the request category
                        const pricingInfo = await Pricing.findOne({
                            attributes: pricingAttributes,
                            where: {
                                isActive: true,
                                locationId: {
                                    $in: permittedLocationsId
                                },
                                categoryId: category
                            },
                            order: [
                                ['updatedAt', 'DESC']
                            ],
                            raw: true
                        });

                        if (pricingInfo) {
                            // Request User Data - Rider Data
                            const requestUserData = await UserProfile.findOne({
                                attributes: userModelColumn,
                                where: {
                                    userId // Rider ID
                                },
                                include: [{
                                    model: User,
                                    as: 'user',
                                    required: true,
                                    where: {
                                        id: userId // Rider ID
                                    },
                                }],
                                raw: true
                            });

                            if (promoId) { // If Promocode supplied
                                promoCodeData = await PromoCode.findOne({
                                    where: {
                                        $and: [
                                            { isEnable: true },
                                            {
                                                expiryDate: {
                                                    $or: [{
                                                        $gte: new Date()
                                                    }, {
                                                        $eq: null
                                                    }]
                                                }
                                            },
                                            { id: promoId }
                                        ]
                                    },
                                    raw: true
                                });
                            }

                            convertCurrency = requestUserData && requestUserData.preferredCurrency;
                            
                            if (bookingId) { // Restrict the declined drivers for the same booking
                                restrictDeclinedDrivers = ` id NOT IN(SELECT driverId FROM BookingHistory WHERE bookingId=${bookingId} AND status=2) `;
                            } else { // Already pending/declined drivers will not get the trip request from the same rider within 2 minute.
                                restrictDeclinedDrivers = ` id NOT IN(SELECT driverId FROM BookingHistory WHERE riderId="${userId}" AND status IN(2, 0) AND updatedAt BETWEEN "${new Date(Date.now() - 2 * 60000).toISOString().slice(0, 19).replace('T', ' ')}" AND "${new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ')}")`;
                            }

                            const findNearestDrivers = await sequelize.query(`
                                SELECT
                                    id,
                                    (
                                        6371 *
                                        acos(
                                            cos( radians( ${pickUpLat} ) ) *
                                            cos( radians( lat ) ) *
                                            cos(
                                                radians( lng ) - radians( ${pickUpLng} )
                                            ) +
                                            sin(radians( ${pickUpLat} )) *
                                            sin(radians( lat ))
                                        )
                                    ) AS distance 
                                FROM
                                    User
                                WHERE
                                    (
                                        lat IS NOT NULL
                                    ) AND (
                                        lng IS NOT NULL
                                    ) AND (
                                        isActive=true
                                    ) AND (
                                        isBan=false
                                    ) AND (
                                        userStatus='active'    
                                    ) AND (
                                        userType=2
                                    ) AND (
                                        activeStatus='active'
                                    ) AND (
                                        deletedAt IS NULL
                                    ) AND (
                                        updatedAt >= "${new Date(Date.now() - 5 * 60000).toISOString().slice(0, 19).replace('T', ' ')}"
                                    ) AND (
                                        id in(SELECT userId FROM Vehicles WHERE vehicleType=${category} AND vehicleStatus='active')    
                                    ) AND (
                                        ${restrictDeclinedDrivers}  
                                    ) AND (
                                        6371 *
                                        acos(
                                            cos( radians( ${pickUpLat} ) ) *
                                            cos( radians( lat ) ) *
                                            cos(
                                                radians( lng ) - radians( ${pickUpLng} )
                                            ) +
                                            sin(radians( ${pickUpLat} )) *
                                            sin(radians( lat ))
                                        )
                                    ) < ${maxDistance}
                                ORDER BY distance ASC LIMIT 5;
                            `, { 
                                type: sequelize.QueryTypes.SELECT
                            });

                            if (findNearestDrivers && findNearestDrivers.length > 0) {
                                driverId = findNearestDrivers[0].id;

                                const driverProfileData = await UserProfile.findOne({
                                    attributes: ['preferredLanguage'],
                                    where: {
                                        userId: driverId
                                    },
                                    raw: true
                                });

                                requestLang = driverProfileData && driverProfileData.preferredLanguage;

                                vehicleData = await Vehicles.findOne({
                                    attributes: ['id', 'userId', 'vehicleNumber', 'vehicleModel', 'vehicleColor'],
                                    where: {
                                        userId: driverId,
                                        vehicleStatus: 'active'
                                    },
                                    raw: true
                                });
                                vehicleId = vehicleData && vehicleData.id;
                                vehicleNumber = vehicleData && vehicleData.vehicleNumber;
                                vehicleModel = vehicleData && vehicleData.vehicleModel;
                                vehicleColor = vehicleData && vehicleData.vehicleColor;

                                // Category Data
                                const categoryData = await Category.findAll({
                                    attributes: ['id', 'categoryName'],
                                    where: {
                                        isActive: true,
                                        id: category
                                    },
                                    raw: true
                                });
    
                                // Currency Rates & information
                                const currencyRatesData = await CurrencyRates.findAll({
                                    attributes: ['currencyCode', 'rate', 'isBase'],
                                    raw: true
                                });
                                baseCurrency = currencyRatesData.find(o => o && o.isBase);
                                baseCurrency = baseCurrency.currencyCode;
                                currencyRatesData.map((item) => { rates[item.currencyCode] = item.rate });
    
                                // Prepare Calculation
                                tripCalculation = await calculateTripCalculation(pricingInfo, null, totalDistance, totalDuration, convertCurrency, promoCodeData, rates, baseCurrency);
    
                                // Promo code
                                isSpecialTrip = tripCalculation.isSpecialTrip;
                                specialTripPrice = tripCalculation.specialTripPrice;
                                specialTripTotalFare = tripCalculation.specialTripTotalFare;
    
                                let paymentType = requestUserData.preferredPaymentMethod;
                                if (requestData.paymentType) {
                                    paymentType = requestData.paymentType;
                                }
    
                                // Create a booking 
                                const createTrip = await Booking.create({
                                    riderLocation: requestData.riderLocation,
                                    riderLocationLat: requestData.riderLocationLat,
                                    riderLocationLng: requestData.riderLocationLng,
                                    pickUpLocation: requestData.pickUpLocation,
                                    pickUpLat,
                                    pickUpLng,
                                    dropOffLocation: requestData.dropOffLocation,
                                    dropOffLat: requestData.dropOffLat,
                                    dropOffLng: requestData.dropOffLng,
                                    riderId: userId,
                                    driverId,
                                    tripStatus: 'created',
                                    vehicleType: category,
                                    totalRideDistance: requestData.rideDistance,
                                    baseFare: tripCalculation.basePrice,
                                    baseUnit: tripCalculation.unitPrice,
                                    baseMinute: tripCalculation.minutePrice,
                                    riderServiceFee: tripCalculation.riderServiceFee,
                                    driverServiceFee: tripCalculation.driverServiceFee,
                                    estimatedTotalFare: tripCalculation.totalFare,
                                    totalFare: tripCalculation.totalFare,
                                    totalDuration, // Default 0 and will calculate the trip duration on trip start & end events
                                    paymentType,
                                    paymentStatus: 'pending',
                                    startDate: new Date(), // Date only
                                    startTime: new Date(), // Timestamp
                                    endDate: new Date(), // Date only
                                    endTime: new Date(), // Timestamp
                                    tripStart: new Date(),
                                    tripEnd: new Date(),
                                    currency: convertCurrency,
                                    riderTotalFare: tripCalculation.totalFareForRider,
                                    driverTotalFare: tripCalculation.totalFareForDriver,
                                    vehicleId,
                                    vehicleNumber,
                                    vehicleModel,
                                    vehicleColor,
                                    promoCodeId: promoCodeData && promoCodeData.id,
                                    isSpecialTrip,
                                    specialTripPrice,
                                    specialTripTotalFare,
                                    pricingId: tripCalculation.pricingId,
                                    riderPayableFare: tripCalculation.riderPayableFare,
                                    bookingType: 1
                                });
    
                                bookingId = createTrip && createTrip.dataValues && createTrip.dataValues.id;
    
                                // Add Booking PromoCode History
                                if (promoCodeData && promoCodeData.id) {
                                    const createBookingPromoCode = await BookingPromoCode.create({
                                        promoId: promoCodeData.id,
                                        bookingId,
                                        title: promoCodeData.title,
                                        code: promoCodeData.code,
                                        type: promoCodeData.type,
                                        promoValue: promoCodeData.promoValue,
                                        currency: promoCodeData.currency,
                                        expiryDate: promoCodeData.expiryDate
                                    });
                                }
    
                                // Create Booking History
                                const createBookingHistory = await BookingHistory.create({
                                    bookingId,
                                    riderId: userId,
                                    driverId,
                                    status: 0
                                });
    
                                // Disable the chosen driver availability for another trip
                                const driverStatusUpdate = await User.update({
                                    activeStatus: 'inactive'
                                }, {
                                    where: {
                                        id: driverId
                                    }
                                });
    
                                // Push Notification - To Driver
                                pushNotificationContent = {
                                    tripStatus: 'tripRequest',
                                    name: requestUserData.firstName + ' ' + requestUserData.lastName,
                                    userId: driverId,
                                    riderId: userId,
                                    picture: requestUserData.picture,
                                    phoneNumber: requestUserData['user.phoneDialCode'] + '' + requestUserData['user.phoneNumber'],
                                    riderLocation: requestData.riderLocation,
                                    riderLocationLat: requestData.riderLocationLat,
                                    riderLocationLng: requestData.riderLocationLng,
                                    pickUpLocation: requestData.pickUpLocation,
                                    pickUpLat,
                                    pickUpLng,
                                    dropOffLocation: requestData.dropOffLocation,
                                    dropOffLat: requestData.dropOffLat,
                                    dropOffLng: requestData.dropOffLng,
                                    bookingId,
                                    category,
                                    overallRating: requestUserData['user.overallRating'],
                                    vehicleId,
                                    vehicleNumber,
                                    vehicleModel,
                                    vehicleColor,
                                    promoCodeId: promoCodeData && promoCodeData.id,
                                    isSpecialTrip,
                                    specialTripPrice,
                                    specialTripTotalFare,
                                    scheduleId: null,
                                    riderPayableFare: tripCalculation.riderPayableFare,
                                    bookingType: 1
                                };
    
                                sendNotifications('tripRequest', pushNotificationContent, driverId, requestLang);
    
                                return await {
                                    status: 200,
                                    errorMessage: null,
                                    data: {
                                        id: driverId,
                                        name: requestUserData.firstName + ' ' + requestUserData.lastName,
                                        userId,
                                        riderId: userId,
                                        picture: requestUserData.picture,
                                        phoneNumber: requestUserData['user.phoneDialCode'] + '' + requestUserData['user.phoneNumber'],
                                        riderLocation: requestData.riderLocation,
                                        riderLocationLat: requestData.riderLocationLat,
                                        riderLocationLng: requestData.riderLocationLng,
                                        pickUpLocation: requestData.pickUpLocation,
                                        pickUpLat,
                                        pickUpLng,
                                        dropOffLocation: requestData.dropOffLocation,
                                        dropOffLat: requestData.dropOffLat,
                                        dropOffLng: requestData.dropOffLng,
                                        bookingId,
                                        category,
                                        overallRating: requestUserData['user.overallRating'],
                                        vehicleId,
                                        vehicleNumber,
                                        vehicleModel,
                                        vehicleColor,
                                        paymentType,
                                        promoCodeId: promoCodeData && promoCodeData.id,
                                        isSpecialTrip,
                                        specialTripPrice,
                                        specialTripTotalFare,
                                        scheduleId: null,
                                        riderPayableFare: tripCalculation.riderPayableFare,
                                        bookingType: 1
                                    }
                                };
                            } else {
                                return {
                                    status: 400,
                                    errorMessage: "Sorry, no drivers available for your ride. Please try again.",
                                    isTryAgain: true
                                }
                            }
                        } else {
                            return {
                                status: 400,
                                errorMessage: 'Sorry, our service unavailable in your location at the moment.'
                            }
                        }
                    } else {
                        return await {
                            status: 400,
                            errorMessage: "Sorry, our service unavailable in your location."
                        }
                    }
                } else {
                    return await {
                        status: 500,
                        errorMessage: "Oops! It looks like you are using your account with a different mobile device. Please try again with the recently connected device."
                    }
                }
            } else {
                return {
                    status: 400,
                    errorMessage: 'Something went wrong. Please try again.',
                };
            }
        } catch (error) {
            return {
                errorMessage: 'Something went wrongss' + error,
                status: 400
            };
        }
    }
};

export default createBooking;

/*

query($requestStatus: String!, $data: String) {
    createBooking(requestStatus: $requestStatus, data: $data) {
        status
        errorMessage
        data {
            id,
            name
            userId
            riderId
            picture
            phoneNumber
            riderLocation
            riderLocationLat
            riderLocationLng
            pickUpLocation
            pickUpLat
            pickUpLng
            dropOffLocation
            dropOffLat
            dropOffLng
            bookingId
            category
            overallRating
            vehicleId
            vehicleNumber
            paymentType
            promoCodeId
            isSpecialTrip
            specialTripPrice
            specialTripTotalFare
        }
    }
}

*/