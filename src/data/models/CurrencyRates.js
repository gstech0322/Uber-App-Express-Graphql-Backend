import DataType from 'sequelize';
import Model from '../sequelize';

const CurrencyRates = Model.define('CurrencyRates', {

  id: {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  currencyCode: {
    type: DataType.STRING,
    allowNull: false,
  },

  rate: {
    type: DataType.FLOAT,
    allowNull: false,
  },

  isBase: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  }

});

export default CurrencyRates;
