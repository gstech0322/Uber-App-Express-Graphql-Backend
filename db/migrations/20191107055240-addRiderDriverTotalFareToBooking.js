'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Booking', 'riderTotalFare', {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0
      }),
      queryInterface.addColumn('Booking', 'driverTotalFare', {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0
      })   
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Booking', 'riderTotalFare'),
      queryInterface.removeColumn('Booking', 'driverTotalFare'),
    ])
  }
};
