import DataType from 'sequelize';
import Model from '../sequelize';

const BookingCancelReason = Model.define('BookingCancelReason', {

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

    cancelStatus: {
        type: DataType.ENUM('cancelledByDriver', 'cancelledByRider'),
    },

    reason: {
        type: DataType.STRING
    }
});

export default BookingCancelReason;