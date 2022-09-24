'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Booking', 'transactionId', {
        type: Sequelize.STRING,
        allowNull: true
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Booking', 'transactionId', {
        type: Sequelize.STRING,
        allowNull: true
      })
    ])

  }
};
