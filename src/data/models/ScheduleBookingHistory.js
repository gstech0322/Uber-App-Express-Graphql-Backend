import DataType from 'sequelize';
import Model from '../sequelize';

const ScheduleBookingHistory = Model.define('ScheduleBookingHistory', {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    bookingId: {
        type: DataType.INTEGER
    },

    scheduleId: {
        type: DataType.INTEGER
    },

    tripStatus: {
        type: DataType.ENUM("scheduled", "completed", "failed", "updated")
    },

    scheduleFrom: {
        type: DataType.DATE
    },
    
    scheduleTo: {
        type: DataType.DATE
    }
})

export default ScheduleBookingHistory