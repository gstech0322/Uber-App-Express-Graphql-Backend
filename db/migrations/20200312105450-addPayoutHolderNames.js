'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Payout', 'firstName', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('Payout', 'lastName', {
        type: Sequelize.STRING
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Payout', 'firstName'),
      queryInterface.addColumn('Payout', 'lastName')
    ])
  }
};
