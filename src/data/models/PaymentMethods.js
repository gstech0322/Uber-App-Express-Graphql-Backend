import DataType from 'sequelize';
import Model from '../sequelize';

const PaymentMethods = Model.define('PaymentMethods', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataType.STRING,
        allowNull: false
    },

    processedIn: {
        type: DataType.STRING,
    },

    fees: {
        type: DataType.STRING,
    },

    currency: {
        type: DataType.STRING,
    },

    details: {
        type: DataType.TEXT,
    },

    isEnable: {
        type: DataType.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    paymentType: {
        type: DataType.INTEGER,
        allowNull: false
    }
});

export default PaymentMethods; 