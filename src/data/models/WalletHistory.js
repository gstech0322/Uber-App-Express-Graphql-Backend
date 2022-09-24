import DataType from 'sequelize';
import Model from '../sequelize';

const WalletHistory = Model.define('WalletHistory', {

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

  transactionId: {
    type: DataType.STRING,
    allowNull: false,
  },

  cardLast4Digits: {
    type: DataType.STRING
  },

  customerId: {
    type: DataType.STRING
  },

  amount: {
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0
  },

  currency: {
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'USD'
  },

  paidBy: {
    type: DataType.TINYINT,
    defaultValue: 1 // 1 => Credit Card
  }

});

export default WalletHistory;