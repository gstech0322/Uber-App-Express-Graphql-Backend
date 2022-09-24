import DataType from 'sequelize';
import Model from '../sequelize';

const UserLogin = Model.define('UserLogin', {

  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  key: {
    type: DataType.TEXT
  },

  userId: {
    type: DataType.UUID
  },

  deviceType: {
    type: DataType.STRING
  },

  deviceDetail: {
    type: DataType.TEXT
  },

  deviceId: {
    type: DataType.STRING
  }

});

export default UserLogin;
