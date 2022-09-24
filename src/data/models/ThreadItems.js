import DataType from 'sequelize';
import Model from '../sequelize';

const ThreadItems = Model.define('ThreadItems', {
    id: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    threadId: {
        type: DataType.INTEGER,
        allowNull: false
    },
    bookingId: {
        type: DataType.INTEGER,
        allowNull: false
    },
    sentBy: {
        type: DataType.STRING,
        allowNull: false
    },
    sendTo: {
        type: DataType.STRING,
        allowNull: false
    },
    content: {
        type: DataType.TEXT
    },
    isRead: {
        type: DataType.BOOLEAN,
        defaultValue: false
    }
});

export default ThreadItems;