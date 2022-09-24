import {Booking, BookingHistory, User, UserProfile, Vehicles} from '../../models';
import BookingRequestType from '../../types/BookingRequestType';
import sequelize from '../../../data/sequelize';

import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';

import {distance as maxDistance} from '../../../config';

import {sendNotifications} from '../../../helpers/push-notification/sendNotifications';

const userModelColumn = ['profileId', 'userId', 'firstName', 'lastName', 'picture',
    'preferredCurrency', 'preferredPaymentMethod', 'preferredLanguage'];

const declineBooking = {

    type: BookingRequestType,

    args: {
        requestStatus: {type: new NonNull(StringType)},
        data: {type: StringType}
    },

    async resolve({request}, {requestStatus, data}) {
        let userId, pickUpLat, pickUpLng, category;
        let bookingId, requestData;
        let driverId, vehicleData, vehicleId, vehicleNumber, vehicleModel, vehicleColor;

        let bookingData, riderId;
        let pushNotificationContent, errorMessage, requestLang;
        let isSpecialTrip, specialTripPrice, specialTripTotalFare, promoCodeData;
        let restrictDeclinedDrivers;

        try {
            requestData = JSON.parse(data);

            if (requestStatus && requestData && requestData.bookingId) {
                userId = requestData.userId;
                bookingId = requestData.bookingId;

                // Get Booking Data
                bookingData = await Booking.findOne({
                    attributes: ['id', 'pickUpLat', 'pickUpLng', 'vehicleType', 'riderId', 'tripStatus',
                        'isSpecialTrip', 'specialTripPrice', 'specialTripTotalFare', 'riderLocation',
                        'riderLocationLat', 'riderLocationLng', 'pickUpLocation', 'pickUpLat', 'pickUpLng',
                        'dropOffLocation', 'dropOffLat', 'dropOffLng', 'paymentType', 'promoCodeId', 'bookingType'],
                    where: {
                        id: bookingId
                    },
                    raw: true
                })

                pickUpLat = bookingData.pickUpLat;
                pickUpLng = bookingData.pickUpLng;
                category = bookingData.vehicleType;
                riderId = bookingData.riderId;
                if (bookingData && bookingData.tripStatus === 'created') {

                    // Request User Data - Rider Data
                    const requestUserData = await UserProfile.findOne({
                        attributes: userModelColumn,
                        where: {
                            userId: riderId // Rider ID
                        }, include: [
                            {
                                model: User,
                                as: 'user',
                                required: true,
                                where: {
                                    id: riderId // Rider ID
                                },
                            }
                        ],
                        raw: true
                    });

                    const requestUserPreferredLang = requestUserData && requestUserData.preferredLanguage;

                    // Update Booking History for Driver Decline history
                    const updateBookingHistory = await BookingHistory.update({
                        status: 2
                    }, {
                        where: {
                            bookingId,
                            driverId: userId
                        }
                    });

                    // Enable the declined driver availability for another trip
                    const driverAvailabilityUpdate = await User.update({
                        activeStatus: 'active'
                    }, {
                        where: {
                            id: userId
                        }
                    });

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
                                id IN(SELECT userId FROM Vehicles WHERE vehicleType=${category} AND vehicleStatus='active')    
                            ) AND (
                                id NOT IN(SELECT driverId FROM BookingHistory WHERE riderId="${riderId}" AND status IN(2, 0) AND updatedAt BETWEEN "${new Date(Date.now() - 1 * 60000).toISOString().slice(0, 19).replace('T', ' ')}" AND "${new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ')}")
                            ) AND (
                                id NOT IN('${userId}')     
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

                        vehicleId = vehicleData.id;
                        vehicleNumber = vehicleData.vehicleNumber;
                        vehicleModel = vehicleData.vehicleModel;
                        vehicleColor = vehicleData.vehicleColor;

                        // Update the booking with new Driver
                        const updateTrip = await Booking.update({
                            driverId,
                            startDate: new Date(), // Date only
                            startTime: new Date(), // Timestamp
                            endDate: new Date(), // Date only
                            endTime: new Date(), // Timestamp
                            tripStart: new Date(),
                            tripEnd: new Date(),
                            vehicleId,
                            vehicleNumber,
                            vehicleModel,
                            vehicleColor
                        }, {
                            where: {
                                id: bookingId
                            }
                        });

                        // Create Booking History for New Driver
                        const createBookingHistory = await BookingHistory.create({
                            bookingId,
                            riderId,
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

                        // Promo code
                        isSpecialTrip = bookingData.isSpecialTrip;
                        specialTripPrice = bookingData.specialTripPrice;
                        specialTripTotalFare = bookingData.specialTripTotalFare;

                        // Push Notification - To Driver
                        pushNotificationContent = {
                            tripStatus: 'tripRequest',
                            name: requestUserData.firstName + ' ' + requestUserData.lastName,
                            userId: riderId,
                            riderId,
                            picture: requestUserData.picture,
                            phoneNumber: requestUserData['user.phoneDialCode'] + '' + requestUserData['user.phoneNumber'],
                            riderLocation: bookingData.riderLocation,
                            riderLocationLat: bookingData.riderLocationLat,
                            riderLocationLng: bookingData.riderLocationLng,
                            pickUpLocation: bookingData.pickUpLocation,
                            pickUpLat: bookingData.pickUpLat,
                            pickUpLng: bookingData.pickUpLng,
                            dropOffLocation: bookingData.dropOffLocation,
                            dropOffLat: bookingData.dropOffLat,
                            dropOffLng: bookingData.dropOffLng,
                            bookingId,
                            category,
                            overallRating: requestUserData['user.overallRating'],
                            vehicleId,
                            vehicleNumber,
                            vehicleModel,
                            vehicleColor,
                            paymentType: bookingData.paymentType,
                            isSpecialTrip,
                            specialTripPrice,
                            specialTripTotalFare
                        };

                        await sendNotifications('tripRequest', pushNotificationContent, driverId, requestLang);

                        return await {
                            status: 200,
                            errorMessage: null,
                            data: {
                                id: driverId,
                                name: requestUserData.firstName,
                                userId,
                                riderId,
                                picture: requestUserData.picture,
                                phoneNumber: requestUserData['user.phoneDialCode'] + '' + requestUserData['user.phoneNumber'],
                                riderLocation: bookingData.riderLocation,
                                riderLocationLat: bookingData.riderLocationLat,
                                riderLocationLng: bookingData.riderLocationLng,
                                pickUpLocation: bookingData.pickUpLocation,
                                pickUpLat,
                                pickUpLng,
                                dropOffLocation: bookingData.dropOffLocation,
                                dropOffLat: bookingData.dropOffLat,
                                dropOffLng: bookingData.dropOffLng,
                                bookingId,
                                category,
                                overallRating: requestUserData['user.overallRating'],
                                vehicleId,
                                vehicleNumber,
                                vehicleModel,
                                vehicleColor,
                                paymentType: bookingData.paymentType,
                                promoCodeId: bookingData.promoCodeId,
                                isSpecialTrip,
                                specialTripPrice,
                                specialTripTotalFare
                            }
                        };
                    } else {
                        // Update Booking to Expired
                        const findPendingDrivers = await BookingHistory.findAll({
                            attributes: ['driverId'],
                            where: {
                                bookingId
                            },
                            raw: true
                        });

                        const pendingDriverIds = findPendingDrivers && findPendingDrivers.map(o => o.driverId);

                        if (pendingDriverIds && pendingDriverIds.length > 0) {
                            // const updatePendingBookingHistory = await BookingHistory.update({
                            //     status: 2
                            // }, {
                            //     where: {
                            //         driverId: {
                            //             $in: pendingDriverIds
                            //         }
                            //     }
                            // });

                            const updatePendingDriverStatus = await User.update({
                                activeStatus: 'active'
                            }, {
                                where: {
                                    id: {
                                        $in: pendingDriverIds
                                    }
                                }
                            });
                        }

                        const updateTripToExpired = await Booking.update({
                            tripStatus: 'expired',
                            isSpecialTrip: false,
                            notes: 'Decline - No drivers found.'
                        }, {
                            where: {
                                id: bookingId
                            }
                        });

                        if (bookingData && bookingData.bookingType === 2) { // If Schedule Booking
                            // Push Notification - To Driver
                            pushNotificationContent = {
                                tripStatus: 'tripRequest',
                                userId: null,
                                riderId,
                                name: requestUserData.firstName,
                                picture: requestUserData.picture,
                                phoneNumber: requestUserData['user.phoneDialCode'] + '' + requestUserData['user.phoneNumber'],
                                overallRating: requestUserData['user.overallRating'],
                                riderLocation: bookingData.riderLocation,
                                riderLocationLat: bookingData.riderLocationLat,
                                riderLocationLng: bookingData.riderLocationLng,
                                pickUpLocation: bookingData.pickUpLocation,
                                pickUpLat: bookingData.pickUpLat,
                                pickUpLng: bookingData.pickUpLng,
                                dropOffLocation: bookingData.dropOffLocation,
                                dropOffLat: bookingData.dropOffLat,
                                dropOffLng: bookingData.dropOffLng,
                                bookingId,
                                category,
                                vehicleId: null,
                                vehicleNumber: null,
                                vehicleModel: null,
                                vehicleColor: null,
                                bookingType: bookingData.bookingType
                            };

                            await sendNotifications('scheduleFailed', pushNotificationContent, riderId, requestUserPreferredLang);
                        }

                        return await {
                            status: 400,
                            errorMessage: "Sorry, no drivers available for your ride. Please try again.",
                            isTryAgain: true
                        };
                    }
                } else {
                    errorMessage = 'Oops! Unable to decline this trip. It looks like this trip is already ';

                    if (bookingData && bookingData.tripStatus === 'approved') {
                        errorMessage = errorMessage + 'accepted.';
                    } else if (bookingData && bookingData.tripStatus === 'declined') {
                        errorMessage = errorMessage + 'declined.';
                    } else if (bookingData && bookingData.tripStatus === 'started') {
                        errorMessage = errorMessage + 'started';
                    } else if (bookingData && bookingData.tripStatus === 'cancelledByRider') {
                        errorMessage = errorMessage + 'canceled by the rider.';
                    } else if (bookingData && bookingData.tripStatus === 'cancelledByDriver') {
                        errorMessage = errorMessage + 'canceled by you or other driver.';
                    } else {
                        errorMessage = errorMessage + 'completed.';
                    }

                    return {
                        status: 400,
                        errorMessage
                    };
                }
            } else {
                return {
                    status: 400,
                    errorMessage: 'Something went wrong. Please try again.',
                };
            }
        } catch (error) {
            return {
                errorMessage: 'Something went wrong' + error,
                status: 400
            };
        }
    }
};

export default declineBooking;

/*

query($requestStatus: String!, $data: String) {
    declineBooking(requestStatus: $requestStatus, data: $data) {
        status
        errorMessage
        data {
            id
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
        }
    }
}

*/