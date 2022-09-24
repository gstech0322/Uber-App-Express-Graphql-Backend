import DataType from 'sequelize';
import Model from '../sequelize';

const Payout = Model.define('Payout', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    methodId: {
        type: DataType.INTEGER,
        allowNull: false,
    },

    userId: {
        type : DataType.UUID,
        defaultValue : DataType.UUIDV1,
        allowNull: false
    },

    payEmail: {
        type: DataType.STRING,
        allowNull: false
    },

    address1: {
        type: DataType.TEXT,
    },

    address2: {
        type: DataType.TEXT,
    },

    city: {
        type: DataType.STRING,
        allowNull: false
    },

    zipcode: {
        type: DataType.STRING,
        allowNull: false
    },

    state: {
        type: DataType.STRING,
        allowNull: false
    },

    country: {
        type: DataType.STRING,
        allowNull: false
    },

    currency: {
        type: DataType.STRING,
        allowNull: false
    },

    default: {
        type: DataType.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },

    last4Digits: {
        type: DataType.INTEGER,
        allowNull: true
    },

    isVerified: {
        type: DataType.BOOLEAN,
        defaultValue: false
    },

    firstName: {
        type: DataType.STRING
    },

    lastName: {
        type: DataType.STRING
    }
    
});

export default Payout; 