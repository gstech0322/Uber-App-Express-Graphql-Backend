'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('UserLogin', 'voipDeviceId'),
      queryInterface.removeColumn('SMSVerification', 'voipDeviceId')
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([]);
  }
};
