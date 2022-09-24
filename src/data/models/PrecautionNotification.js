import DataType from 'sequelize';
import Model from '../sequelize';

const PrecautionNotification = Model.define('PrecautionNotification', {
    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataType.STRING,
        allowNull: false
    },
    description: {
        type: DataType.TEXT('long'),
        allowNull: false
    },
    isEnabled: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    imageName: {
        type: DataType.STRING
    }
});

export default PrecautionNotification;