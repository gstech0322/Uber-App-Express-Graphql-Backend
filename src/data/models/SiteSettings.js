import DataType from 'sequelize';
import Model from '../sequelize';

const SiteSettings = Model.define('SiteSettings', {

  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  title: {
    type: DataType.STRING,
    allowNull: false,
  },

  name: {
    type: DataType.STRING,
    allowNull: false,
  },

  value: {
    type: DataType.TEXT,
  },

  type: {
    type: DataType.STRING,
  }

});

export default SiteSettings;
