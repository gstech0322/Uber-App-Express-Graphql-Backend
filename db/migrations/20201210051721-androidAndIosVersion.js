'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert('SiteSettings', [
        {
          title: 'App Force Update',
          name: 'appForceUpdate',
          value: 'true',
          type: 'appSettings',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          title: 'Rider Android Version',
          name: 'riderAndroidVersion',
          value: '1.6.3',
          type: 'appSettings',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          title: 'Rider iOS Version',
          name: 'riderIosVersion',
          value: '1.6.3',
          type: 'appSettings',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          title: 'Driver Android Version',
          name: 'driverAndroidVersion',
          value: '1.6.3',
          type: 'appSettings',
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          title: 'Driver iOS Version',
          name: 'driverIosVersion',
          value: '1.6.3',
          type: 'appSettings',
          createdAt: new Date(),
          updatedAt: new Date()
        }])
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query("DELETE FROM SiteSettings WHERE type='appSettings';")
    ])
  }
};
