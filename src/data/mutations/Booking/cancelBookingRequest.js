
import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull
} from 'graphql';
import { Booking, BookingHistory, User } from '../../models';
import BookingRequestType from '../../types/BookingRequestType';

const cancelBookingRequest = {

    type: BookingRequestType,

    args: {
        userId: { type: new NonNull(StringType) }
    },

    async resolve({ request }, { userId }) { 
        let errorMessage, status, data;

        try {
            // Booking Data
            const bookingData = await Booking.findOne({
                attributes: ['id', 'driverId', 'tripStatus'],
                where: {
                    riderId: userId,

                },
                order: [['createdAt', 'DESC']],
                raw: true 
            });

            if (bookingData && bookingData.tripStatus === 'created') {

                const bookingUpdate = await Booking.update({
                    tripStatus: 'cancelledByRider',
                    isSpecialTrip: false
                }, {
                    where: {
                        id: bookingData.id
                    }
                });
        
                const driverStatusUpdate = await User.update({
                    activeStatus: 'active'
                }, {
                    where: {
                        id: bookingData.driverId
                    }
                });

                const bookingHistoryUpdate = await BookingHistory.update({
                    status: 4
                }, {
                    where: {
                        bookingId: bookingData.id,
                        driverId: bookingData.driverId
                    }
                });

                status = 200;
                data = {
                    id: userId,
                    userId: userId,
                    driverId: bookingData.driverId,
                    bookingId: bookingData.id,
                    tripStatus: 'cancelledByRider'
                };
            } else {
                errorMessage = 'Oops! It looks like something went wrong! Please close your application and try again.';
                status = 400;
                data = {
                    id: userId,
                    userId: userId,
                    driverId: bookingData && bookingData.driverId,
                    bookingId: bookingData && bookingData.id,
                    tripStatus: bookingData && bookingData.tripStatus
                };
            }

            return await {
                errorMessage,
                status,
                data
            };
        } catch(error) {
            return {
                errorMessage: 'Oops! Something went wrong' + error,
                status: 400
            };
        }  
    }
};

export default cancelBookingRequest;

/*

mutation($userId: String!) {
    cancelBookingRequest(userId: $userId) {
        status
        errorMessage
        data {
            id
            userId
            driverId
            bookingId
            tripStatus
        }
    }
}

*/