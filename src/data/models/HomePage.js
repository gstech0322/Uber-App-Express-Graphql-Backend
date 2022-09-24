import DataType from 'sequelize';
import Model from '../sequelize';

const HomePage = Model.define('HomePage', {

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
  }

});

export default HomePage;
