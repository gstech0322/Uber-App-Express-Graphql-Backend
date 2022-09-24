import DataType from 'sequelize';
import Model from '../sequelize';

const BookingHistory = Model.define('BookingHistory', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    bookingId: {
        type : DataType.INTEGER,
        allowNull: false,
    },

    riderId: {
        type: DataType.UUID,
        allowNull: false,
    },

    driverId: {
        type: DataType.UUID,
        allowNull: false,
    },

    status: {
        type: DataType.INTEGER,
        defaultValue: 0
    }
});

export default BookingHistory;