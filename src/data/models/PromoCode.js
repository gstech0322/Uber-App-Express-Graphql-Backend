import DataType from 'sequelize';
import Model from '../sequelize';

const PromoCode = Model.define('PromoCode', {

  id: {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  title: {
    type: DataType.STRING,
    allowNull: false,
  },

  description: {
    type: DataType.STRING(255),
    allowNull: false,
  },

  code: {
    type: DataType.STRING,
    allowNull: false,
  },

  type: {
    type: DataType.TINYINT, // (1 => percentage, 2 => fixed)
    defaultValue: 1 
  },

  promoValue: {
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  },

  currency: {
    type: DataType.STRING
  },

  expiryDate: {
    type: DataType.DATE
  },

  isEnable: {
    type: DataType.BOOLEAN,
    defaultValue: true,
  }

});

export default PromoCode;
