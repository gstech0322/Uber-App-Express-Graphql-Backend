'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('UserProfile', 'paymentIntentStatus'),
      queryInterface.removeColumn('UserProfile', 'three_d_secure')
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([])
  }
};
