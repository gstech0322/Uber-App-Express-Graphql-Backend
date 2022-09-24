import DataType from 'sequelize';
import Model from '../sequelize';

const ScheduleBooking = Model.define('ScheduleBooking', {
    id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    riderId: {
        type: DataType.UUID
    },

    bookingId: {
        type: DataType.INTEGER,
        allowNull: false
    },

    tripStatus: {
        type: DataType.ENUM('scheduled', 'completed', 'failed')
    },

    scheduleFrom: {
        type: DataType.DATE
    },

    scheduleTo: {
        type: DataType.DATE
    }
});

export default ScheduleBooking;