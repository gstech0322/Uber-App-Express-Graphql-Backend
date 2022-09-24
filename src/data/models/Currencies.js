import DataType from 'sequelize';
import Model from '../sequelize';

const Currencies = Model.define('Currencies', {

  id: {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement : true
  },

  symbol: {
    type: DataType.STRING,
    allowNull: false,
  },

  isEnable: {
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },

  isBaseCurrency: {
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },

  isPayment: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  }

});

export default Currencies;
