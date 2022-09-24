import DataType from 'sequelize';
import Model from '../sequelize';

const Location = Model.define('Location', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    locationName: {
        type: DataType.STRING,
        allowNull: false,
    },

    coordinates: {
        type: DataType.TEXT,
        allowNull: false,
    },

    geometryCoordinates: {
        type: DataType.GEOMETRY('POLYGON')
    },

    description: {
        type: DataType.STRING,
        allowNull: false,
    },

    isActive: {
        type: DataType.BOOLEAN,
        defaultValue: true
    }

});

export default Location;