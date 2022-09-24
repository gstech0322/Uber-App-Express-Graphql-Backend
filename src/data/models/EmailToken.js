import DataType from 'sequelize';
import Model from '../sequelize';

const EmailToken = Model.define('EmailToken', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    userId: {
        type: DataType.UUID,
        allowNull: false
    },

    email: {
        type: DataType.STRING,
        allowNull: false
    },

    token: {
        type: DataType.STRING,
        allowNull: false
    }

});

export default EmailToken;