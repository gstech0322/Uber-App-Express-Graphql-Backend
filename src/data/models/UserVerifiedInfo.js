import DataType from 'sequelize';
import Model from '../sequelize';

const UserVerifiedInfo = Model.define('UserVerifiedInfo', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    userId: {
        type : DataType.UUID,
        defaultValue : DataType.UUIDV1,
        allowNull: false
    },

    isEmailConfirmed: {
        type: DataType.BOOLEAN,
        defaultValue: false,
    },

    isLicenseFrontVerified: {
        type: DataType.BOOLEAN,
        defaultValue: false,
    },

    isLicenseBackVerified: {
        type: DataType.BOOLEAN,
        defaultValue: false,
    }
});

export default UserVerifiedInfo;