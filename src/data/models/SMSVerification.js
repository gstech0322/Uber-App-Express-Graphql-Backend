import DataType from 'sequelize';
import Model from '../sequelize';

const SMSVerification = Model.define('SMSVerification', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },

    phoneNumber: {
        type: DataType.STRING,
        allowNull: false
    },

    phoneDialCode: {
        type: DataType.STRING,
        allowNull: false
    },

    userId: {
        type: DataType.UUID,
    },

    deviceId: {
        type: DataType.TEXT
    },

    deviceType: {
        type: DataType.TEXT
    },

    otp: {
        type: DataType.INTEGER
    }

});

export default SMSVerification;