'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Booking', 'vehicleId', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('Booking', 'vehicleNumber', {
        type: Sequelize.STRING
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Booking', 'vehicleId'),
      queryInterface.removeColumn('Booking', 'vehicleNumber')
    ])
  }
};
