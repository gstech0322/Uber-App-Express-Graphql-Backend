'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('UserProfile', 'walletBalance', {
        type: Sequelize.FLOAT,
        defaultValue: 0
      }),
      queryInterface.addColumn('UserProfile', 'walletUsed', {
        type: Sequelize.FLOAT,
        defaultValue: 0
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('UserProfile', 'walletBalance'),
      queryInterface.removeColumn('UserProfile', 'walletUsed')
    ])
  }
};
