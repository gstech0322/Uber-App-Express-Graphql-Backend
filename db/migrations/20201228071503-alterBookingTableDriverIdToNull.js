'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Booking', 'driverId', {
        type: Sequelize.STRING,
        allowNull: true
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Booking', 'driverId', {
        type: Sequelize.STRING,
        allowNull: false
      })
    ])
  }
};
