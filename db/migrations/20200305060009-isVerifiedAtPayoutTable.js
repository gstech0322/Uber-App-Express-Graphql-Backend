'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Payout', 'isVerified', {
        type: Sequelize.BOOLEAN
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Payout', 'isVerified')
    ])
  }
};
