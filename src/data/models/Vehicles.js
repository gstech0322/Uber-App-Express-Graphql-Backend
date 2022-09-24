import DataType from 'sequelize';
import Model from '../sequelize';

const Vehicles = Model.define('Vehicles', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    userId: {
        type: DataType.UUID,
        defaultValue: DataType.UUIDV1,
        allowNull: false
    },

    vehicleName: {
        type: DataType.STRING
    },

    vehicleNumber: {
        type: DataType.STRING
    },

    availableSeats: {
        type: DataType.INTEGER
    },
    vehicleModel: {
        type: DataType.STRING
    },
    vehicleColor: {
        type: DataType.STRING
    },

    vehicleType: {
        type: DataType.INTEGER
    },

    vehicleStatus: {
        type: DataType.ENUM('pending', 'active', 'inactive'),
        defaultValue: 'pending',
    },

    vehicleRC: {
        type: DataType.STRING
    },

    vehicleInsurance: {
        type: DataType.STRING
    },
});

export default Vehicles;