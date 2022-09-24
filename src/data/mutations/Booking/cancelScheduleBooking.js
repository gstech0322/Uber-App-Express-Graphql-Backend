import {
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType
} from 'graphql';

import {
    Booking,
    ScheduleBooking,
    ScheduleBookingHistory
} from '../../models';

import BookingRequestType from '../../types/BookingRequestType';

import { 
    getUserBanStatus
} from '../../../helpers/booking/commonHelpers';

const cancelScheduleBooking = {

    type: BookingRequestType,

    args: {
        bookingId: { type: new NonNull(IntType) }
    },

    async resolve({ request }, { bookingId }) {
        try {
            let riderId;
            if (request && request.user) {
                riderId = request.user.id;

                const { userStatusErrorMessage } = await getUserBanStatus(riderId);
                if (userStatusErrorMessage) {
                    return {
                        status: 400,
                        errorMessage: userStatusErrorMessage
                    };
                }

                const bookingData = await Booking.findOne({
                    attributes: ['id', 'tripStatus'],
                    where: {
                        id: bookingId,
                        riderId
                    },
                    raw: true
                });

                if (bookingData && bookingData.tripStatus === 'scheduled') {
                    // Update Booking Status
                    await Booking.update({
                        tripStatus: 'cancelledByRider',
                        isSpecialTrip: false
                    }, {
                        where: {
                            id: bookingId
                        }
                    });
                    // Find the Schedule Booking data
                    const scheduledBookingData = await ScheduleBooking.findOne({
                        attributes: ['id', 'scheduleFrom', 'scheduleTo'],
                        where: {
                            bookingId,
                            riderId
                        },
                        raw: true
                    });
                    // Update the Schedule booking data
                    await ScheduleBooking.update({
                        tripStatus: 'failed',
                    }, {
                        where: {
                            bookingId
                        }
                    });

                    if (scheduledBookingData) { // Create Schedule Booking History
                        await ScheduleBookingHistory.create({
                            bookingId,
                            scheduleId: scheduledBookingData.id,
                            tripStatus: 'failed',
                            scheduleFrom: scheduledBookingData.scheduleFrom,
                            scheduleTo: scheduledBookingData.scheduleTo
                        });
                    }

                    return await {
                        status: 200
                    };
                } else {
                    return {
                        status: 400,
                        errorMessage: 'Oops! Something went wrong! Please close your application and try again.'
                    };
                }
            } else {
                return {
                    status: 500,
                    errorMessage: 'Oops! Please login with your account and try again.'
                }
            }
        } catch (error) {
            return {
                errorMessage: 'Oops! Something went wrong' + error,
                status: 400
            };
        }
    }
};

export default cancelScheduleBooking;

/*

mutation ($bookingId: Int!) {
    cancelScheduleBooking(bookingId: $bookingId) {
        status
        errorMessage
    }
}

*/