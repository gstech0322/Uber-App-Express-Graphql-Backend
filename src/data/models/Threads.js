import DataType from 'sequelize';
import Model from '../sequelize';

const Threads = Model.define('Threads', {
    id: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    bookingId: {
        type: DataType.INTEGER,
        allowNull: false
    },
    riderId: {
        type: DataType.UUID,
        allowNull: false
    },
    driverId: {
        type: DataType.UUID,
        allowNull: false
    },
    messageUpdatedDate: {
        type: DataType.DATE,
    },
    riderUnreadCount: {
        type: DataType.INTEGER,
        defaultValue: 0
    },
    driverUnreadCount: {
        type: DataType.INTEGER,
        defaultValue: 0
    }
});

export default Threads;