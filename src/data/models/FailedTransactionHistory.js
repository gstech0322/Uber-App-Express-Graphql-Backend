import DataType from 'sequelize';
import Model from '../sequelize';

const FailedTransactionHistory = Model.define('FailedTransactionHistory', {

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

    driverId: {
        type: DataType.UUID,
        allowNull: false,
    },

    riderId: {
        type: DataType.UUID,
        allowNull: false,
    },

    amount: {
        type: DataType.FLOAT,
        allowNull: false,
    },

    currency: {
        type: DataType.STRING,
        allowNull: false,
    },

    reason: {
        type: DataType.TEXT,
        allowNull: false,
    },
});

export default FailedTransactionHistory;