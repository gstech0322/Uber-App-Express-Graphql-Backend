import DataType from 'sequelize';
import Model from '../sequelize';

const Country = Model.define('Country', {

  id: {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement : true
  },
  
  countryCode: {
    type: DataType.STRING,
    allowNull: false,
  },

  countryName: {
    type: DataType.STRING,
    allowNull: false,
  },

  isEnable: {
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },

  dialCode: {
    type: DataType.STRING,
    allowNull: false,
  },

});

export default Country;