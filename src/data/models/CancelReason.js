import DataType from 'sequelize';
import Model from '../sequelize';

const CancelReason = Model.define('CancelReason', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    
    userType: {
        type: DataType.INTEGER,
        allowNull: false,
    },

    reason: {
        type: DataType.STRING,
        allowNull: false,
    },

    isActive: {
        type: DataType.BOOLEAN
    }
});

export default CancelReason;