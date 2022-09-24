import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType,
    GraphQLInt as IntType
} from 'graphql';
import moment from 'moment';
import BookingRequestType from '../../types/BookingRequestType';
import calculateTripCalculation from '../../../libs/calculateTripCalculation';
import {
    getUserLoginData,
    checkRiderActiveBooking,
    findPermittedLocation,
    findPricing,
    findPromoCodeData,
    createBookingData,
    createBookingPromoCode
} from '../../../helpers/booking/bookingHelpers';
import {
    createScheduleBookingData,
    createScheduleBookingHistory,
    checkScheduleBookingDuration
} from '../../../helpers/booking/scheduleBookingHelpers';
import {
    getCurrencyRates,
    getUserProfileData,
    getUserBanStatus
} from '../../../helpers/booking/commonHelpers';

const createScheduleBooking = {

    type: BookingRequestType,

    args: {
        riderLocation: {type: new NonNull(StringType)},
        riderLocationLat: {type: new NonNull(FloatType)},
        riderLocationLng: {type: new NonNull(FloatType)},
        pickUpLocation: {type: new NonNull(StringType)},
        pickUpLat: {type: new NonNull(FloatType)},
        pickUpLng: {type: new NonNull(FloatType)},
        dropOffLocation: {type: new NonNull(StringType)},
        dropOffLat: {type: new NonNull(FloatType)},
        dropOffLng: {type: new NonNull(FloatType)},
        rideDistance: {type: new NonNull(FloatType)},
        rideDuration: {type: new NonNull(FloatType)},
        category: {type: new NonNull(IntType)},
        deviceId: {type: new NonNull(StringType)},
        deviceType: {type: new NonNull(StringType)},
        promoId: {type: IntType},
        paymentType: {type: new NonNull(IntType)},
        scheduleFrom: {type: new NonNull(IntType)},
        scheduleTo: {type: new NonNull(IntType)}
    },

    async resolve({request}, {
        riderLocation, riderLocationLat, riderLocationLng, pickUpLocation, pickUpLat, pickUpLng,
        dropOffLocation, dropOffLat, dropOffLng, rideDistance, rideDuration, category, paymentType,
        promoId, deviceId, deviceType, scheduleFrom, scheduleTo
    }) {
        try {
            let userId, totalRideDistance, totalDuration, bookingId;
            let convertCurrency, tripCalculation, promoCodeData;
            let isSpecialTrip, specialTripPrice, specialTripTotalFare;
            let formattedScheduleFrom, formattedScheduleTo;

            // Geo-Fencing
            let permittedLocationsId;

            if (request && request.user) {
                userId = request.user.id; // Current logged-in user ID
                totalRideDistance = rideDistance || 0; // Total distance of the ride
                totalDuration = rideDuration || 0; // Total duration of the ride

                const {userStatusErrorMessage} = await getUserBanStatus(userId);
                if (userStatusErrorMessage) {
                    return {
                        status: 400,
                        errorMessage: userStatusErrorMessage
                    };
                }

                // User Login - Current Device
                const userLoginData = await getUserLoginData(userId, deviceId, deviceType);

                if (userLoginData) { // Check current request with logged-in user device

                    if (scheduleFrom) {
                        formattedScheduleFrom = moment.unix(scheduleFrom).set({s: 0}).format('YYYY-MM-DD HH:mm:ss');
                        formattedScheduleTo = moment.unix(scheduleTo).set({s: 0}).format('YYYY-MM-DD HH:mm:ss');
                    }

                    const {
                        status: eligibleStatus,
                        errorMessage: eligibleErrorMessage
                    } = await checkScheduleBookingDuration(formattedScheduleFrom);
                    if (eligibleStatus !== 200) {
                        return {
                            status: eligibleStatus,
                            errorMessage: eligibleErrorMessage
                        };
                    }

                    // Check the rider has active booking or scheduled booking before/after 30 minutes
                    const {status, errorMessage} = await checkRiderActiveBooking(userId, formattedScheduleFrom);
                    if (status !== 200) {
                        return {
                            status,
                            errorMessage
                        };
                    }

                    // Check the pick up location in eligible to ride
                    permittedLocationsId = await findPermittedLocation(pickUpLat, pickUpLng);

                    if (permittedLocationsId && permittedLocationsId.length > 0) {
                        // Find the pricing for the allowed location with the request category
                        const pricingInfo = await findPricing(category, permittedLocationsId);

                        if (pricingInfo) {
                            // Request User Data - Rider Data
                            const requestUserData = await getUserProfileData(userId);
                            convertCurrency = requestUserData && requestUserData.preferredCurrency;
                            paymentType = paymentType || requestUserData.preferredPaymentMethod;

                            if (promoId) { // If Promocode supplied && find the promo code data
                                promoCodeData = await findPromoCodeData(promoId, userId, formattedScheduleFrom);
                            }

                            // Currency Rates & information
                            const {baseCurrency, rates} = await getCurrencyRates();

                            // Prepare Calculation
                            tripCalculation = await calculateTripCalculation(pricingInfo, null, totalRideDistance, totalDuration, convertCurrency, promoCodeData, rates, baseCurrency);

                            // Promo code calculation
                            isSpecialTrip = tripCalculation && tripCalculation.isSpecialTrip;
                            specialTripPrice = tripCalculation && tripCalculation.specialTripPrice;
                            specialTripTotalFare = tripCalculation && tripCalculation.specialTripTotalFare;

                            let requestData = {
                                riderLocation, riderLocationLat, riderLocationLng,
                                pickUpLocation, pickUpLat, pickUpLng, dropOffLocation, dropOffLat, dropOffLng,
                                riderId: userId,
                                driverId: null,
                                tripStatus: 'scheduled',
                                vehicleType: category,
                                totalRideDistance,
                                totalDuration,
                                paymentType,
                                vehicleId: null,
                                vehicleNumber: null,
                                vehicleModel: null,
                                vehicleColor: null,
                                bookingType: 2,
                                startDate: formattedScheduleFrom,
                                startTime: formattedScheduleFrom,
                                endDate: formattedScheduleFrom,
                                endTime: formattedScheduleFrom,
                                tripStart: formattedScheduleFrom,
                                tripEnd: formattedScheduleFrom,
                                promoCodeId: promoCodeData && promoCodeData.id,
                                currency: convertCurrency,
                                pricingId: tripCalculation && tripCalculation.pricingId,
                                baseFare: tripCalculation && tripCalculation.basePrice,
                                baseUnit: tripCalculation && tripCalculation.unitPrice,
                                baseMinute: tripCalculation && tripCalculation.minutePrice,
                                riderServiceFee: tripCalculation && tripCalculation.riderServiceFee,
                                driverServiceFee: tripCalculation && tripCalculation.driverServiceFee,
                                estimatedTotalFare: tripCalculation && tripCalculation.totalFare,
                                totalFare: tripCalculation && tripCalculation.totalFare,
                                riderTotalFare: tripCalculation && tripCalculation.totalFareForRider,
                                driverTotalFare: tripCalculation && tripCalculation.totalFareForDriver,
                                isSpecialTrip,
                                specialTripPrice,
                                specialTripTotalFare,
                                riderPayableFare: tripCalculation && tripCalculation.riderPayableFare,
                            };

                            bookingId = await createBookingData(requestData);

                            // Add Booking PromoCode History
                            if (bookingId && promoCodeData && promoCodeData.id) {
                                await createBookingPromoCode(bookingId, promoCodeData);
                            }

                            const scheduleId = await createScheduleBookingData(bookingId, userId, formattedScheduleFrom, formattedScheduleTo);
                            await createScheduleBookingHistory(bookingId, scheduleId, formattedScheduleFrom, formattedScheduleTo, 'scheduled');

                            return await {
                                status: 200,
                                result: {
                                    bookingId
                                }
                            };
                        } else {
                            return {
                                status: 400,
                                errorMessage: 'Sorry, our service unavailable in your location at the moment.'
                            };
                        }
                    } else {
                        return {
                            status: 400,
                            errorMessage: "Sorry, our service unavailable in your location."
                        };
                    }
                } else {
                    return {
                        status: 500,
                        errorMessage: "Oops! It looks like you are using your account with a different mobile device. Please try again with the recently connected device."
                    };
                }
            } else {
                return {
                    status: 500,
                    errorMessage: 'Oops! Please login with your account and try again.',
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

export default createScheduleBooking;

/*

mutation (
    $riderLocation: String!,
    $riderLocationLat: Float!,
    $riderLocationLng: Float!,
    $pickUpLocation: String!,
    $pickUpLat: Float!,
    $pickUpLng: Float!,
    $dropOffLocation: String!,
    $dropOffLat: Float!,
    $dropOffLng: Float!,
    $rideDistance: Float!,
    $rideDuration: Float!,
    $category: Int!,
    $deviceId: String!,
    $deviceType: String!,
    $promoId: Int,
    $paymentType: Int!,
    $scheduleFrom: Int!,
    $scheduleTo: Int!
) {
    createScheduleBooking (
        riderLocation: $riderLocation,
        riderLocationLat: $riderLocationLat,
        riderLocationLng: $riderLocationLng,
        pickUpLocation: $pickUpLocation,
        pickUpLat: $pickUpLat,
        pickUpLng: $pickUpLng,
        dropOffLocation: $dropOffLocation,
        dropOffLat: $dropOffLat,
        dropOffLng: $dropOffLng,
        rideDistance: $rideDistance,
        rideDuration: $rideDuration,
        category: $category,
        deviceId: $deviceId,
        deviceType: $deviceType,
        promoId: $promoId,
        paymentType: $paymentType,
        scheduleFrom: $scheduleFrom,
        scheduleTo: $scheduleTo
    ) {
        status
        errorMessage
        result {
            bookingId
        }
    }
}

*/