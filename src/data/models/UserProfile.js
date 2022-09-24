import DataType from 'sequelize';
import Model from '../sequelize';

const UserProfile = Model.define('UserProfile', {

  profileId: {
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },

  userId: {
    type: DataType.UUID
  },

  firstName: {
    type: DataType.STRING,
  },

  lastName: {
    type: DataType.STRING,
  },

  picture: {
    type: DataType.STRING,
  },

  lat: {
    type: DataType.FLOAT,
  },

  lng: {
    type: DataType.FLOAT,
  },

  state: {
    type: DataType.STRING,
  },

  city: {
    type: DataType.STRING,
  },

  zipcode: {
    type: DataType.STRING,
  },

  country: {
    type: DataType.STRING,
  },

  preferredCurrency: {
    type: DataType.STRING,
    defaultValue: "USD"
  },

  preferredLanguage: {
    type: DataType.STRING,
    defaultValue: "en"
  },

  preferredPaymentMethod: {
    type: DataType.BOOLEAN,
    defaultValue: 1
  },

  paymentCustomerId: {
    type: DataType.STRING
  },

  licenceFront: {
    type: DataType.STRING
  },

  licenceBack: {
    type: DataType.STRING
  },

  cardLastFour: {
    type: DataType.INTEGER,
  },

  cardToken: {
    type: DataType.STRING(255),
  },

  sourceId: {
    type: DataType.STRING(255),
  },

  walletBalance: {
    type: DataType.FLOAT,
    defaultValue: 0
  },

  walletUsed: {
    type: DataType.FLOAT,
    defaultValue: 0
  },

  paymentMethodId: {
    type: DataType.STRING,
    defaultValue: 0
  }

});

export default UserProfile;
