import DataType from 'sequelize';
import Model from '../sequelize';
import bcrypt from 'bcrypt';

const User = Model.define('User', {

  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  email: {
    type: DataType.STRING(255),
    validate: { isEmail: true },
    allowNull: false,
  },

  password: {
    type: DataType.STRING,
    allowNull: false,
  },

  phoneNumber: {
    type: DataType.STRING,
    allowNull: false,
  },

  phoneDialCode: {
    type: DataType.STRING,
    allowNull: false,
  },

  phoneCountryCode: {
    type: DataType.STRING
  },

  lat: {
    type: DataType.FLOAT
  },

  lng: {
    type: DataType.FLOAT
  },

  userStatus: {
    type: DataType.ENUM('pending', 'active', 'inactive'),
    defaultValue: 'pending',
  },

  isActive: {
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },

  isBan: {
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },

  userType: {
    type: DataType.BOOLEAN,
    defaultValue: 1
  },

  activeStatus: {
    type: DataType.ENUM('active', 'inactive') 
  },

  overallRating: {
    type: DataType.FLOAT,
    allowNull: true,
    defaultValue: 0
  },

  deletedAt: {
    type: DataType.DATE,
    defaultValue: null
  }
}, {
    indexes: [
      { fields: ['email'] },
    ],
  });

User.prototype.generateHash = function (password) { // eslint-disable-line  
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

export default User;

