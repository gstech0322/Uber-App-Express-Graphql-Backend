import DataType from 'sequelize';
import Model from '../sequelize';

const TempImages = Model.define('TempImages', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    tableName: {
        type: DataType.STRING
    },

    fieldName: {
        type: DataType.STRING
    },

    fileName: {
        type: DataType.STRING
    }

});

export default TempImages;