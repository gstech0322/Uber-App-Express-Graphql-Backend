import { Booking, BookingHistory, User, BookingCancelReason, UserProfile } from '../../models';
import BookingRequestType from '../../types/BookingRequestType'; 

import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType
} from 'graphql';

import { sendNotifications } from '../../../helpers/push-notification/sendNotifications';

const cancelBooking = {

    type: BookingRequestType,

    args: {
        bookingId: { type: new NonNull(IntType) },
        requestBy: { type: new NonNull(StringType) },
        userId: { type: new NonNull(StringType) },
        reason: { type: StringType },
    },

    async resolve({ request }, { bookingId, requestBy, userId, reason }) { 
        let errorMessage, isDriver = false, id;
        let pushNotificationContent, requestLang;

        try {
            // Booking Data
            const bookingData = await Booking.findOne({
                attributes: ['tripStatus', 'driverId', 'riderId', 'isSpecialTrip'],
                where: {
                    id: bookingId
                },
                raw: true 
            });

            let restrictedStatus = ['cancelledByRider', 'cancelledByDriver', 'completed', 'expired'];

            if (bookingData && restrictedStatus.indexOf(bookingData.tripStatus) >= 0) {
                isDriver = (bookingData.driverId === userId) ? true : false;
                if (bookingData.tripStatus === 'cancelledByRider') {
                    errorMessage = 'Oops! It looks like the trip is already cancelled by ';
                    errorMessage = errorMessage + ((isDriver) ? 'the rider.' : ' you.');
                } else if (bookingData.tripStatus === 'cancelledByDriver') {
                    errorMessage = 'Oops! It looks like the trip is already cancelled by ';
                    errorMessage = errorMessage + ((isDriver) ? 'you.' : ' the driver.');
                } else if (bookingData.tripStatus === 'completed') {
                    errorMessage = 'Oops! It looks like the trip is already completed.';
                } else {
                    errorMessage = 'Oops! It looks like something went wrong! Please close your application and try again.'
                }

                return {
                    errorMessage,
                    status: 400
                };

            } else if(bookingData) {
                const bookingUpdate = await Booking.update({
                    tripStatus: requestBy,
                    isSpecialTrip: (requestBy === 'cancelledByDriver' ? false : bookingData.isSpecialTrip)
                }, {
                    where: {
                        id: bookingId,
                    }
                });
        
                const driverStatusUpdate = await User.update({
                    activeStatus: 'active'
                }, {
                    where: {
                        id: bookingData.driverId
                    }
                });
        
                //if (requestBy === 'cancelledByDriver') {
                    const bookingHistoryUpdate = await BookingHistory.update({
                        status: (requestBy === 'cancelledByDriver' ? 2 : 4)
                    }, {
                        where: {
                            bookingId,
                            driverId: bookingData.driverId
                        }
                    });
                //}

                id = (requestBy === 'cancelledByDriver') ? bookingData.riderId : bookingData.driverId;

                if (requestBy === 'cancelledByDriver') {
                    const riderProfileData = await UserProfile.findOne({
                        attributes: ['preferredLanguage'],
                        where: {
                            userId: bookingData.riderId
                        },
                        raw: true
                    });

                    requestLang = riderProfileData && riderProfileData.preferredLanguage;
                } else {
                    const driverProfileData = await UserProfile.findOne({
                        attributes: ['preferredLanguage'],
                        where: {
                            userId: bookingData.driverId
                        },
                        raw: true
                    });

                    requestLang = driverProfileData && driverProfileData.preferredLanguage;
                }

                // Push Notification
                pushNotificationContent = { // To Driver for cancelledByRider & To Rider for cancelledByDriver
                    tripStatus: requestBy,
                    bookingId
                };
                await sendNotifications(requestBy, pushNotificationContent, id, requestLang);

                if(reason) {
                   await BookingCancelReason.create({
                        bookingId,
                        riderId: bookingData.riderId,
                        driverId: bookingData.driverId,
                        reason,
                        cancelStatus: requestBy
                    });
                }
                
                return await { 
                    status: 200,
                    data: {
                        id, 
                        bookingId
                    }
                };
            } else {
                return {
                    errorMessage: 'Oops! It looks like something went wrong! Please close your application and try again.',
                    status: 400
                };
            }
        } catch(error) {
            return {
                errorMessage: 'Oops! Something went wrong' + error,
                status: 400
            };
        }  
    }
};

export default cancelBooking;

/*

mutation($bookingId: Int!, $requestBy: String!, $userId: String!) {
    cancelBooking(bookingId: $bookingId, requestBy: $requestBy, userId: $userId) {
        status
        errorMessage
        data {
            id
            bookingId
        }
    }
}

*/