import DataType from 'sequelize';
import Model from '../sequelize';

const Pricing = Model.define('Pricing', {
    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    categoryId: {
        type: DataType.INTEGER
    },

    locationId: {
        type: DataType.INTEGER
    },

    unitPrice: { /* Per Mile */
        type: DataType.FLOAT,
        defaultValue: 0
    },

    minutePrice: {
        type: DataType.FLOAT,
        defaultValue: 0
    },

    basePrice: {
        type: DataType.FLOAT,
        defaultValue: 0
    },

    currency: {
        type: DataType.STRING,
        defaultValue: "USD"
    },

    riderFeeType: {
        type: DataType.ENUM('fixed', 'percentage'),
        defaultValue: 'percentage'
    },

    riderFeeValue: {
        type: DataType.FLOAT,
        allowNull: false,
    },

    driverFeeType: {
        type: DataType.ENUM('fixed', 'percentage'),
        defaultValue: 'percentage'
    },

    driverFeeValue: {
        type: DataType.FLOAT,
        allowNull: false
    },

    isActive: {
        type: DataType.BOOLEAN,
        defaultValue: 1
    },

    isSurgePrice: {
        type: DataType.BOOLEAN,
        defaultValue: 0
    }

});

export default Pricing;