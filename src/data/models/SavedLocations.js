import DataType from 'sequelize';
import Model from '../sequelize';

const SavedLocations = Model.define('SavedLocations', {

  id: {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement : true
  },
  
  userId: {
    type: DataType.STRING,
    allowNull: false,
  },

  location: {
    type: DataType.STRING
  },

  lat: {
    type: DataType.FLOAT
  },

  lng: {
    type: DataType.FLOAT
  },

  locationType: {
    type: DataType.ENUM('home', 'work', 'other')
  },

  locationName: {
    type: DataType.STRING
  }

});

export default SavedLocations;