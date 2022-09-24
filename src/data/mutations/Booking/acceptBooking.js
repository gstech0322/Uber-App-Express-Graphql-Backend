import {Booking, BookingHistory, User, UserProfile, UserLogin} from '../../models';

import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType
} from 'graphql';

import BookingRequestType from '../../types/BookingRequestType';

import {sendNotifications} from '../../../helpers/push-notification/sendNotifications';

const acceptBooking = {

    type: BookingRequestType,

    args: {
        bookingId: {type: new NonNull(IntType)},
        driverId: {type: new NonNull(StringType)},
        riderId: {type: new NonNull(StringType)}
    },

    async resolve({request}, {bookingId, driverId, riderId}) {
        let pushNotificationContent, requestLang, errorMessage;
        try {
            const bookingData = await Booking.findOne({
                attributes: ['id', 'tripStatus', 'vehicleId', 'vehicleNumber', 'vehicleModel', 'vehicleColor'],
                where: {
                    id: bookingId
                },
                raw: true
            });

            if (bookingData && bookingData.tripStatus === 'created') {
                // Update booking history status for the accepted driver
                const bookingHistoryUpdate = await BookingHistory.update({
                    status: 1
                }, {
                    where: {
                        bookingId,
                        driverId
                    }
                });

                // Update the booking status to "approved"
                const bookingTripUpdate = await Booking.update({
                    tripStatus: 'approved'
                }, {
                    where: {
                        id: bookingId
                    }
                });

                // Pulling the accepted driver information
                const driverData = await User.findOne({
                    where: {
                        id: driverId
                    },
                    include: [{
                        model: UserProfile,
                        as: 'profile',
                        required: true,
                        where: {
                            userId: driverId
                        },
                    }],
                    raw: true
                });

                const riderProfileData = await UserProfile.findOne({
                    attributes: ['preferredLanguage', 'firstName', 'lastName'],
                    where: {
                        userId: riderId
                    },
                    raw: true
                })

                requestLang = riderProfileData && riderProfileData.preferredLanguage;

                // Push Notification to Rider
                pushNotificationContent = {
                    tripStatus: 'tripAccept',
                    driverId,
                    name: riderProfileData.firstName + ' ' + riderProfileData.lastName,
                    picture: driverData['profile.picture'],
                    driverLat: driverData.lat,
                    driverLng: driverData.lng,
                    phoneNumber: driverData.phoneDialCode + '' + driverData.phoneNumber,
                    bookingId,
                    overallRating: driverData.overallRating,
                    locationUpdate: false,
                    vehicleId: bookingData.vehicleId,
                    vehicleNumber: bookingData.vehicleNumber,
                    vehicleModel: bookingData.vehicleModel,
                    vehicleColor: bookingData.vehicleColor,
                };

                sendNotifications('tripAccept', pushNotificationContent, riderId, requestLang);

                return await {
                    status: 200,
                    errorMessage: null,
                    data: {
                        id: riderId, // Rider ID
                        userId: driverId,
                        driverId,
                        name: driverData['profile.firstName'] + ' ' + driverData['profile.lastName'],
                        picture: driverData['profile.picture'],
                        driverLat: driverData.lat,
                        driverLng: driverData.lng,
                        phoneNumber: driverData.phoneDialCode + '' + driverData.phoneNumber,
                        bookingId,
                        overallRating: driverData.overallRating,
                        locationUpdate: false,
                        vehicleId: bookingData.vehicleId,
                        vehicleNumber: bookingData.vehicleNumber,
                        vehicleModel: bookingData.vehicleModel,
                        vehicleColor: bookingData.vehicleColor,
                    }
                };
            } else {
                errorMessage = 'Oops! Unable to accept this trip. It looks like this trip is already ';

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
        } catch (error) {
            return {
                errorMessage: 'Something went wrong' + error,
                status: 400
            };
        }
    }
};

export default acceptBooking;

/*

mutation($bookingId: Int!, $driverId: String!, $riderId: String!) {
    acceptBooking(bookingId: $bookingId, driverId: $driverId, riderId: $riderId) {
        status
        errorMessage
        data {
            id
            userId
            driverId
            name
            picture
            driverLat
            driverLng
            phoneNumber
            bookingId
            overallRating
            locationUpdate
            vehicleId
            vehicleNumber
        }
    }
}

*/