import { Booking,BookingHistory,User,UserProfile } from '../../models';
import BookingRequestType from '../../types/BookingRequestType';

import {
    GraphQLNonNull as NonNull,
    GraphQLString as StringType
} from 'graphql';

const autoCancel = {

    type: BookingRequestType,

    args: {
        riderId: { type: new NonNull(StringType) }
    },

    async resolve({ request }, { riderId }) { 
        try {
            const bookingData = await Booking.findOne({
                attributes: ['id', 'driverId', 'riderId'],
                where: {
                    riderId,
                    tripStatus: 'created'
                },
                order: [
                    [`id`, `DESC`],
                ]
            }); 

            if(bookingData) {
                const bookingUpdate = await Booking.update({
                    tripStatus: 'expired',
                    isSpecialTrip: false,
                    notes: 'Auto canceled by rider'
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
                    status: 2
                }, {
                    where: {
                        bookingId: bookingData.id,
                        driverId: bookingData.driverId
                    }
                });
            
                return await { 
                    status: 200,
                    data: {
                        id: bookingData.riderId, 
                        bookingId: bookingData.id 
                    }
                };
            } else {
                return await { 
                    status: 400, 
                    errorMessage: 'No Records Found'
                };
            }
        } catch(error){
            return {
                errorMessage: 'Something went wrong' + error,
                status: 400
            };  
        } 
          
    }
};

export default autoCancel;

/*

mutation($riderId: String!) {
    autoCancel(riderId: $riderId) {
        status
        errorMessage
        data {
            id
            bookingId
        }
    }
}

*/