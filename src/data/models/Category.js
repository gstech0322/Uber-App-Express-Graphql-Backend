import DataType from 'sequelize';
import Model from '../sequelize';

const Category = Model.define('Category', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    categoryName: {
        type: DataType.STRING
    },

    categoryImage: {
        type: DataType.STRING
    },

    categoryMarkerImage: {
        type: DataType.STRING
    },

    unitPrice: {
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

    isActive: {
        type: DataType.BOOLEAN,
        defaultValue: 1
    },

    currency: {
        type: DataType.STRING,
        defaultValue: "USD"
    },

    riderFeeType: {
        type: DataType.ENUM('fixed', 'percentage'),
        allowNull: true
    },

    riderFeeValue: {
        type: DataType.FLOAT,
        allowNull: true
    },

    driverFeeType: {
        type: DataType.ENUM('fixed', 'percentage'),
        allowNull: true
    },

    driverFeeValue: {
        type: DataType.FLOAT,
        allowNull: true
    },

    capacity: {
        type: DataType.INTEGER,
        allowNull: true
    }
});

export default Category;