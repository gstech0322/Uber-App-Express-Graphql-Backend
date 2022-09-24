import DataType from 'sequelize';
import Model from '../sequelize';

const BookingPromoCode = Model.define('BookingPromoCode', {

  id: {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  promoId: {
    type: DataType.INTEGER
  },

  bookingId: {
    type: DataType.INTEGER
  },

  title: {
    type: DataType.STRING
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
  }

});

export default BookingPromoCode;
