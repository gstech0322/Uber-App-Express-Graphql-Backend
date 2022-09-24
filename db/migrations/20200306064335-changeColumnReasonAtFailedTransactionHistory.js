'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('FailedTransactionHistory', 'reason', {
        type: Sequelize.TEXT,
        allowNull: false
    })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('FailedTransactionHistory', 'reason')
    ])
  }
};
