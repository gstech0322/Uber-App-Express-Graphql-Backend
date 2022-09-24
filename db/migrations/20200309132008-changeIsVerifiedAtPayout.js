'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Payout', 'isVerified', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Payout', 'isVerified')
    ])
  }
};
