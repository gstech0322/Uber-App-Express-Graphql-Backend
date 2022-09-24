import {Booking, User, UserProfile} from '../../models';

import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType
} from 'graphql';

import BookingRequestType from '../../types/BookingRequestType';

import {sendNotifications} from '../../../helpers/push-notification/sendNotifications';

const startBooking = {

    type: BookingRequestType,

    args: {
        bookingId: {type: new NonNull(IntType)},
        driverId: {type: new NonNull(StringType)},
        riderId: {type: new NonNull(StringType)}
    },

    async resolve({request}, {bookingId, driverId, riderId}) {
        let errorMessage = '';
        let pushNotificationContent, requestLang;

        try {
            // Get the booking data
            const bookingData = await Booking.findOne({
                attributes: ['id', 'tripStatus', 'vehicleId', 'vehicleNumber', 'vehicleModel', 'vehicleColor'],
                where: {
                    id: bookingId
                },
                raw: true
            });

            if (bookingData) {
                if (bookingData.tripStatus === 'approved') {
                    // Update the booking status to "started"
                    const bookingTripUpdate = await Booking.update({
                        tripStatus: 'started',
                        tripStart: new Date()
                    }, {
                        where: {
                            id: bookingId
                        }
                    });

                    // Pulling the driver information
                    const driverData = await User.findOne({
                        where: {
                            id: driverId
                        },
                        include: [
                            {
                                model: UserProfile,
                                as: 'profile',
                                required: true,
                                where: {
                                    userId: driverId
                                },
                            }
                        ],
                        raw: true
                    });

                    const riderProfileData = await UserProfile.findOne({
                        attributes: ['preferredLanguage'],
                        where: {
                            userId: riderId
                        },
                        raw: true
                    });

                    requestLang = riderProfileData && riderProfileData.preferredLanguage;

                    // Push Notification to Rider
                    pushNotificationContent = {
                        tripStatus: 'tripStart',
                        driverId,
                        name: driverData['profile.firstName'] + ' ' + driverData['profile.lastName'],
                        picture: driverData['profile.picture'],
                        driverLat: driverData.lat,
                        driverLng: driverData.lng,
                        phoneNumber: driverData.phoneDialCode + '' + driverData.phoneNumber,
                        bookingId,
                        overallRating: driverData.overallRating,
                        locationUpdate: true,
                        vehicleId: bookingData.vehicleId,
                        vehicleNumber: bookingData.vehicleNumber,
                        vehicleModel: bookingData.vehicleModel,
                        vehicleColor: bookingData.vehicleColor
                    };
                    await sendNotifications('tripStart', pushNotificationContent, riderId, requestLang);

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
                            locationUpdate: true,
                            vehicleId: bookingData.vehicleId,
                            vehicleNumber: bookingData.vehicleNumber,
                            vehicleModel: bookingData.vehicleModel,
                            vehicleColor: bookingData.vehicleColor
                        }
                    };
                } else {
                    if (bookingData.tripStatus === 'started') {
                        errorMessage = 'Oops! it looks like you have already started this trip. Please close your application and try again.';
                    } else if (bookingData.tripStatus === 'cancelledByRider') {
                        errorMessage = 'Oops! it looks like the rider has already cancelled this trip. Please close your application and try again.';
                    } else if (bookingData.tripStatus === 'cancelledByDriver') {
                        errorMessage = 'Oops! it looks like you have already cancelled this trip. Please close your application and try again.';
                    } else {
                        errorMessage = 'Oops! it looks like you have already completed this trip. Please close your application and try again.';
                    }

                    return await {
                        status: 400,
                        errorMessage,
                        data: {
                            tripStatus: bookingData.tripStatus
                        }
                    };
                }
            } else {
                return await {
                    status: 400,
                    errorMessage: 'Oops! it looks like something went wrong with your trip. Please try again.',
                };
            }


        } catch (error) {
            return {
                errorMessage: 'Oops! Something went wrong' + error,
                status: 400
            };
        }
    }
};

export default startBooking;

/*

mutation($bookingId: Int!, $driverId: String!, $riderId: String!) {
    startBooking(bookingId: $bookingId, driverId: $driverId, riderId: $riderId) {
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
        }
    }
}

*/