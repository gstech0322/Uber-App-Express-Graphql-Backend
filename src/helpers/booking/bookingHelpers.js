import moment from 'moment';
import sequelize from '../../data/sequelize';
import {
    UserLogin,
    Booking,
    BookingHistory,
    ScheduleBooking,
    Location,
    Pricing,
    BookingPromoCode,
    PromoCode
} from '../../data/models';

// Getting user login information
const getUserLoginData = async (userId, deviceId, deviceType) => {
    try {
        return await UserLogin.findOne({
            attributes: ['id'],
            where: {
                userId,
                deviceId,
                deviceType
            },
            raw: true
        });
    } catch (error) {
        console.log('getUserLoginData Error: ', error);
        return null;
    }
};

// Check the rider is having active rides or scheduled ride before 30 minutes or after 30 minutes
const checkRiderActiveBooking = async (riderId, bookingDate, existingScheduleId) => {
    try {
        let status = 200, errorMessage, preRequestedDate, postRequestedDate, exitingScheduleIdFilter = {};
        if (riderId) {
            const requestedDate = moment(bookingDate) || moment(new Date());
            preRequestedDate = requestedDate.format('YYYY-MM-DD HH:mm');
            postRequestedDate = requestedDate.format('YYYY-MM-DD HH:mm');

            const getActiveBooking = await Booking.findOne({
                attributes: ['id'],
                where: {
                    riderId,
                    bookingType: 1,
                    tripStatus: {
                        $in: ['created', 'approved', 'started']
                    }
                },
                raw: true
            });

            if (getActiveBooking) {
                status = 400;
                errorMessage = 'Oops! It looks like you are in a ride. Please cancel the ride and try again.';
            } else {
                preRequestedDate = moment(preRequestedDate).subtract(30, 'minutes').format('YYYY-MM-DD HH:mm');
                postRequestedDate = moment(postRequestedDate).add(30, 'minutes').format('YYYY-MM-DD HH:mm');
                if (existingScheduleId && existingScheduleId.toString().trim() !== '') {
                    exitingScheduleIdFilter = {
                        id: {
                            $ne: existingScheduleId
                        }
                    }
                }
                ;

                const getActiveScheduleBooking = await ScheduleBooking.findOne({
                    attributes: ['id'],
                    where: {
                        $and: [{
                            riderId,
                            tripStatus: 'scheduled',
                            scheduleFrom: {
                                $between: [new Date(preRequestedDate), new Date(postRequestedDate)]
                            }
                        },
                            exitingScheduleIdFilter
                        ]
                    },
                    raw: true
                });

                if (getActiveScheduleBooking) {
                    status = 400;
                    errorMessage = 'Oops! It looks like you have scheduled a ride in 30 minutes. Please cancel the existing ride and try again.';
                }
            }
        } else {
            status = 400;
            errorMessage = 'Oops! Something went wrong. Please try again.';
        }

        return await {
            status,
            errorMessage
        };
    } catch (error) {
        console.log('checkRiderActiveBooking Error: ', error);
        return {
            status: 400,
            errorMessage: error
        }
    }
};

// Check the pick up location in eligible to ride and find the permission geo locations IDs
const findPermittedLocation = async (pickUpLat, pickUpLng) => {
    try {
        let requestLocationPoint, contains, permittedLocationsId;

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

        permittedLocationsId = permittedLocations && permittedLocations.length > 0 && permittedLocations.map(x => {
            return x['id']
        }) || [];

        return await permittedLocationsId;
    } catch (error) {
        console.log('findPermittedLocation Error: ', error);
        return [];
    }
}

// Find the pricing for the allowed location with the request category
const findPricing = async (categoryId, permittedLocationsId) => {
    try {
        return await Pricing.findOne({
            attributes: [
                'id', 'categoryId', 'unitPrice', 'minutePrice', 'basePrice', 'currency', 'riderFeeType',
                'riderFeeValue', 'driverFeeType', 'driverFeeValue', 'isActive', 'isSurgePrice'
            ],
            where: {
                isActive: true,
                locationId: {
                    $in: permittedLocationsId
                },
                categoryId
            },
            order: [
                ['updatedAt', 'DESC']
            ],
            raw: true
        });
    } catch (error) {
        console.log('findPricing Error: ', error);
        return null;
    }
}

// Find the promo code by id with the expiry date
const findPromoCodeData = async (id, userId, requestDate) => {
    try {
        let expiryDate = requestDate ? requestDate : new Date();

        return await PromoCode.findOne({
            where: {
                $and: [
                    {id},
                    {isEnable: true},
                    {
                        id: {
                            $notIn: [
                                sequelize.literal(`SELECT promoCodeId FROM Booking WHERE riderId="${userId}" AND isSpecialTrip=1`)
                            ]
                        }
                    },
                    {
                        expiryDate: {
                            $or: [{
                                $gte: expiryDate
                            }, {
                                $eq: null
                            }]
                        }
                    }
                ]
            },
            raw: true
        });
    } catch (error) {
        console.log('findPromoCodeData Error: ', error);
        return null;
    }
}

const createBookingData = async (requestData) => {
    try {
        const createRide = await Booking.create({
            riderLocation: requestData.riderLocation,
            riderLocationLat: requestData.riderLocationLat,
            riderLocationLng: requestData.riderLocationLng,
            pickUpLocation: requestData.pickUpLocation,
            pickUpLat: requestData.pickUpLat,
            pickUpLng: requestData.pickUpLng,
            dropOffLocation: requestData.dropOffLocation,
            dropOffLat: requestData.dropOffLat,
            dropOffLng: requestData.dropOffLng,
            riderId: requestData.riderId,
            driverId: requestData.driverId,
            tripStatus: requestData.tripStatus, // created or scheduled
            vehicleType: requestData.vehicleType,
            totalRideDistance: requestData.totalRideDistance,
            baseFare: requestData.baseFare,
            baseUnit: requestData.baseUnit,
            baseMinute: requestData.baseMinute,
            riderServiceFee: requestData.riderServiceFee,
            driverServiceFee: requestData.driverServiceFee,
            estimatedTotalFare: requestData.estimatedTotalFare,
            totalFare: requestData.totalFare,
            totalDuration: requestData.totalDuration, // Default 0 and will calculate the trip duration on trip start & end events
            paymentType: requestData.paymentType,
            paymentStatus: 'pending',
            startDate: requestData.startDate, // Date only
            startTime: requestData.startTime, // Timestamp
            endDate: requestData.endDate, // Date only
            endTime: requestData.endTime, // Timestamp
            tripStart: requestData.tripStart,
            tripEnd: requestData.tripEnd,
            currency: requestData.currency,
            riderTotalFare: requestData.riderTotalFare,
            driverTotalFare: requestData.driverTotalFare,
            vehicleId: requestData.vehicleId,
            vehicleNumber: requestData.vehicleNumber,
            vehicleModel: requestData.vehicleModel,
            vehicleColor: requestData.vehicleColor,
            promoCodeId: requestData.promoCodeId,
            isSpecialTrip: requestData.isSpecialTrip,
            specialTripPrice: requestData.specialTripPrice,
            specialTripTotalFare: requestData.specialTripTotalFare,
            pricingId: requestData.pricingId,
            riderPayableFare: requestData.riderPayableFare,
            bookingType: requestData.bookingType
        });

        return await createRide && createRide.dataValues && createRide.dataValues.id;
    } catch (error) {
        console.log('createBookingData Error: ', error);
        return null;
    }
}

const createBookingPromoCode = async (bookingId, promoCodeData) => {
    try {
        const createBookingPromoData = await BookingPromoCode.create({
            bookingId,
            promoId: promoCodeData.id,
            title: promoCodeData.title,
            code: promoCodeData.code,
            type: promoCodeData.type,
            promoValue: promoCodeData.promoValue,
            currency: promoCodeData.currency,
            expiryDate: promoCodeData.expiryDate
        });

        return createBookingPromoData && createBookingPromoData.dataValues && createBookingPromoData.dataValues.id;
    } catch (error) {
        console.log('createBookingPromoCode Error: ', error);
        return null;
    }
}

const getBookingData = async (id, riderId, driverId, attributes) => {
    try {
        let where = {id};
        riderId ? where['riderId'] = riderId : null; // Rider ID Filter
        driverId ? where['driverId'] = driverId : null; // Driver ID Filter

        return await Booking.findOne({
            attributes,
            where,
            raw: true
        });
    } catch (error) {
        console.log('getBookingData Error: ', error);
        return null;
    }
}

const getNearestDrivers = async (userId, pickUpLat, pickUpLng, category, bookingId, maxDistance, alreadyAssignedDrivers) => {
    try {
        let alreadyDeclinedDuration = 2; // minutes
        let driverLastActiveDuration = 5; // Minutes
        let restrictDeclinedDrivers = bookingId ?
            `id NOT IN(SELECT driverId FROM BookingHistory WHERE bookingId=${bookingId} AND status=2) ` :
            ` id NOT IN(SELECT driverId FROM BookingHistory WHERE riderId="${userId}" AND status IN(2, 0) AND updatedAt BETWEEN "${new Date(Date.now() - alreadyDeclinedDuration * 60000).toISOString().slice(0, 19).replace('T', ' ')}" AND "${new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ')}")`

        let restrictActiveTripDrivers = alreadyAssignedDrivers && alreadyAssignedDrivers.length > 0 ? `id NOT IN(${alreadyAssignedDrivers})` : '1=1';

        return await sequelize.query(`
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
                                    updatedAt >= "${new Date(Date.now() - driverLastActiveDuration * 60000).toISOString().slice(0, 19).replace('T', ' ')}"
                                ) AND (
                                    id in(SELECT userId FROM Vehicles WHERE vehicleType=${category} AND vehicleStatus='active')    
                                ) AND (
                                    ${restrictDeclinedDrivers}  
                                ) AND (
                                    ${restrictActiveTripDrivers}
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
    } catch (error) {
        console.log('getNearestDrivers Error: ', error);
        return null;
    }
}

const updateBookingStatus = async (id, tripStatus, notes) => {
    try {
        await Booking.update({
            tripStatus,
            notes
        }, {
            where: {
                id
            }
        });
        return true;
    } catch (error) {
        console.log('updateBookingStatus Error: ', error);
        return false;
    }
}

const createBookingHistory = async (bookingId, riderId, driverId) => {
    try {
        return await BookingHistory.create({
            bookingId,
            riderId,
            driverId,
            status: 0
        });
    } catch (error) {
        console.log('createBookingHistory Error: ', error);
        return null;
    }
}

module.exports = {
    getUserLoginData,
    checkRiderActiveBooking,
    findPermittedLocation,
    findPricing,
    findPromoCodeData,
    createBookingData,
    createBookingPromoCode,
    getBookingData,
    getNearestDrivers,
    updateBookingStatus,
    createBookingHistory
};