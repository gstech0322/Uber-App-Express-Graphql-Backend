import DataType from 'sequelize';
import Model from '../sequelize';

const EmergencyContact = Model.define('EmergencyContact', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    userId: {
        type: DataType.UUID,
        allowNull: false,
    },

    phoneNumber: {
        type: DataType.STRING,
        allowNull: false,
    },

    contactName: {
        type: DataType.STRING,
        allowNull: false,
    }
});

export default EmergencyContact;