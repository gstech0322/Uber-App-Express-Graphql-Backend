'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('PrecautionNotification', 'description', {
        type: Sequelize.TEXT('long'),
        allowNull: false
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('PrecautionNotification', 'description', {
        type: Sequelize.STRING,
        allowNull: false
      })
    ])
  }
};