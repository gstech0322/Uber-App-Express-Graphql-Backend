'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('UserLogin', 'voipDeviceId', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      }),
      queryInterface.addColumn('SMSVerification', 'voipDeviceId', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('UserLogin', 'voipDeviceId'),
      queryInterface.removeColumn('SMSVerification', 'voipDeviceId')
    ]);
  }
};
