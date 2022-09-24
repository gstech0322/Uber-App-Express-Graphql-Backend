import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull
} from 'graphql';

import sequelize from '../../../data/sequelize';

import {
    ScheduleBooking,
    ScheduleBookingHistory
} from '../../models';

import scheduleBookingCommonType from '../../types/scheduleBooking/scheduleBookingCommonType';

const editScheduleBooking = {

    type: scheduleBookingCommonType,

    args: {
        bookingId: { type: new NonNull(IntType) },
        scheduleFrom: { type: new NonNull(StringType) },
        scheduleTo: { type: new NonNull(StringType) }
    },

    async resolve({ request }, { bookingId, scheduleFrom, scheduleTo }) {

        if (request.user) {
            try {

                let userId = request.user.id;
                let scheduleDateTime = new Date(Number(scheduleFrom)).toJSON().replace('T', ' ').split('.')[0];

                let previousSchedules = await ScheduleBooking.findOne({
                    attributes: [
                        [sequelize.literal(`TIMESTAMPDIFF(MINUTE, scheduleFrom,"${scheduleDateTime}")`), 'minute_difference']
                    ],
                    where: {
                        $and: [{
                                tripStatus: "scheduled"
                            },
                            {
                                bookingId: {
                                    $in: sequelize.literal(`(select id from Booking where riderId = "${userId}" and (tripStatus="scheduled" or tripStatus="created") and id != ${bookingId})`)
                                }
                            }
                        ]
                    },
                    having: {
                        minute_difference: {
                            $between: [-30, 30]
                        }
                    }
                });

                if (previousSchedules) {
                    return {
                        status: 400,
                        errorMessage: "You have already scheduled a ride before 30 minutes"
                    }
                };

                let updatedSchedule = await ScheduleBooking.findOne({
                    where: {
                        bookingId
                    },
                    raw: true
                });

                if (updatedSchedule) {
                    await ScheduleBooking.update({
                        scheduleFrom: Number(scheduleFrom),
                        scheduleTo: Number(scheduleTo)
                    }, {
                        where: {
                            bookingId
                        }
                    });

                    await ScheduleBookingHistory.create({
                        bookingId: bookingId,
                        scheduleId: updatedSchedule.scheduleId,
                        scheduleFrom: Number(scheduleFrom),
                        scheduleTo: Number(scheduleTo),
                        tripStatus: "updated"
                    })

                } else {
                    return {
                        status: 400,
                        errorMessage: "Invalid booking id"
                    }
                }

                return {
                    status: 200
                };

            } catch (error) {
                console.log(error)
                return {
                    status: 400,
                    errorMessage: "Something went wrong " + error
                }
            }
        } else {
            return {
                status: 500,
                errorMessage: "Oops! it looks like you are not logged-in with your account. Please login to continue."
            }
        }
    }
}

export default editScheduleBooking