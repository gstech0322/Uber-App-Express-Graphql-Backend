import DataType from 'sequelize';
import Model from '../sequelize';

const BookingTips = Model.define('BookingTips', {

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

    paymentType : {
        type: DataType.INTEGER,
        allowNull: true,
    },

    amount: {
        type: DataType.FLOAT,
        allowNull: false,
    },

    riderCurrency: {
        type: DataType.STRING,
        allowNull: false,
    },

    driverCurrency: {
        type: DataType.STRING,
        allowNull: false,
    },

    transactionId: {
        type: DataType.STRING
    },

});

export default BookingTips;