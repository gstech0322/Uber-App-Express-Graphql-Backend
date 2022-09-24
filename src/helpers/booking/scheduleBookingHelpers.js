import moment from 'moment';
import {
    ScheduleBooking,
    ScheduleBookingHistory,
    Booking
} from '../../data/models';

const createScheduleBookingData = async (bookingId, riderId, scheduleFrom, scheduleTo) => {
    try {
        const createSchedule = await ScheduleBooking.create({
            bookingId,
            riderId,
            scheduleFrom,
            scheduleTo,
            tripStatus: "scheduled"
        });

        return await createSchedule && createSchedule.dataValues && createSchedule.dataValues.id;
    } catch (error) {
        console.log('createScheduleBookingData Error: ', error);
        return null;
    }
}

const createScheduleBookingHistory = async (bookingId, scheduleId, scheduleFrom, scheduleTo, tripStatus) => {
    try {
        return await ScheduleBookingHistory.create({
            bookingId,
            scheduleId,
            scheduleFrom,
            scheduleTo,
            tripStatus
        });
    } catch (error) {
        console.log('createScheduleBookingHistory Error: ', error);
        return null;
    }
}

const checkScheduleBookingDuration = async (requestDate, from = 15, to = 30, fromDuration = 'minutes', toDuration = 'days') => {
    try {
        let errorMessage;
        if (from && to) {
            const today = moment().utc().unix();
            const expectedStartTime = moment().add(from, fromDuration).utc().unix();
            const expectedEndTime = moment().add(to, toDuration).utc().unix();
            const requestedDate = moment(requestDate).utc().unix();
            if (today < requestedDate) {
                if (requestedDate < expectedStartTime || requestedDate > expectedEndTime) {
                    errorMessage = 'Oops! You are trying to book a restricted date and time. Please contact our support team.';
                }
            } else {
                errorMessage = 'Oops! It looks like you are trying to book a past date and please try with the future dates.';
            }
        } else {
            errorMessage = 'Oops! Something went wrong. Please try again.';
        }

        return {
            status: errorMessage ? 400 : 200,
            errorMessage
        };
    } catch (error) {
        return {
            status: 400,
            errorMessage: error
        };
    }
}

const updateBookingDetails = async (bookingId, driverId, vehicleId, vehicleNumber, vehicleModel, vehicleColor) => {
    try {
        return await Booking.update({
            driverId,
            vehicleId,
            vehicleNumber,
            vehicleModel,
            vehicleColor,
            startDate: new Date(),
            startTime: new Date(),
            endDate: new Date(),
            endTime: new Date(),
            tripStart: new Date(),
            tripEnd: new Date()
        }, {
            where: {
                id: bookingId
            }
        });
    } catch (error) {
        console.log('updateBookingDetails Error: ', error);
        return false;
    }
}

const updateScheduleBookingStatus = async (
    bookingId, scheduleBookingStatus = 'failed', bookingStatus = 'expired',
    notes = 'Schedule Booking auto trip request CRON - No nearest drivers available.'
) => {
    try {
        await ScheduleBooking.update({
            tripStatus: scheduleBookingStatus
        }, {
            where: {
                bookingId
            }
        })

        await Booking.update({
            tripStatus: bookingStatus,
            notes
        }, {
            where: {
                id: bookingId
            }
        });

        return true;
    } catch (error) {
        console.log('updateSchdeuleBookingFailedStatus Error: ', error);
        return false;
    }
}

module.exports = {
    createScheduleBookingData,
    createScheduleBookingHistory,
    checkScheduleBookingDuration,
    updateBookingDetails,
    updateScheduleBookingStatus
};