import moment from 'moment';
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

import { getUserBanStatus } from '../../../helpers/booking/commonHelpers';
import { checkRiderActiveBooking } from '../../../helpers/booking/bookingHelpers';
import { checkScheduleBookingDuration } from '../../../helpers/booking/scheduleBookingHelpers';

const updateScheduleBooking = {

    type: BookingRequestType,

    args: {
        bookingId: { type: new NonNull(IntType) },
        scheduleId: { type: new NonNull(IntType) },
        scheduleFrom: { type: new NonNull(IntType) },
        scheduleTo: { type: new NonNull(IntType) }
    },

    async resolve({ request }, { bookingId, scheduleId, scheduleFrom, scheduleTo }) {
        try {
            let riderId;
            let formattedScheduleFrom, formattedScheduleTo;
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
                    if (scheduleFrom) {
                        formattedScheduleFrom =  moment.unix(scheduleFrom).set({ s: 0 }).format('YYYY-MM-DD HH:mm:ss');
                        formattedScheduleTo =  moment.unix(scheduleTo).set({ s: 0 }).format('YYYY-MM-DD HH:mm:ss');
                    }

                    const { status: eligibleStatus, errorMessage: eligibleErrorMessage } = await checkScheduleBookingDuration(formattedScheduleFrom);
                    if (eligibleStatus !== 200) {
                        return {
                            status: eligibleStatus,
                            errorMessage: eligibleErrorMessage
                        };
                    }

                    // Check the rider has active booking or scheduled booking before/after 30 minutes
                    const { status, errorMessage } = await checkRiderActiveBooking(riderId, formattedScheduleFrom, scheduleId);
                    if (status !== 200) {
                        return {
                            status,
                            errorMessage
                        };
                    }

                    // Update the Schedule booking data
                    await ScheduleBooking.update({
                        scheduleFrom: formattedScheduleFrom,
                        scheduleTo: formattedScheduleTo
                    }, {
                        where: {
                            bookingId,
                            id: scheduleId,
                            riderId
                        }
                    });
                    // Update Booking Date & Times
                    await Booking.update({
                        startDate: formattedScheduleFrom, 
                        startTime: formattedScheduleFrom, 
                        endDate: formattedScheduleFrom, 
                        endTime: formattedScheduleFrom, 
                        tripStart: formattedScheduleFrom,
                        tripEnd: formattedScheduleFrom
                    }, {
                        where: {
                            id: bookingId,
                            riderId
                        }
                    });
                    // Create Schedule Booking History
                    await ScheduleBookingHistory.create({
                        bookingId,
                        scheduleId,
                        tripStatus: 'updated',
                        scheduleFrom: formattedScheduleFrom,
                        scheduleTo: formattedScheduleTo
                    });
                    
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

export default updateScheduleBooking;

/*

mutation ($bookingId: Int!, $scheduleId: Int!, $scheduleFrom: Int!, $scheduleTo: Int!) {
    updateScheduleBooking(bookingId: $bookingId, scheduleId: $scheduleId, scheduleFrom: $scheduleFrom, scheduleTo: $scheduleTo) {
        status
        errorMessage
    }
}

*/