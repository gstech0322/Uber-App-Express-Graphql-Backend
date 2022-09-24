'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Booking', 'startDate', {
        type: Sequelize.DATEONLY,
        allowNull: false,
      }),
      queryInterface.changeColumn('Booking', 'startTime', {
        type: Sequelize.DATE,
        allowNull: false,
      }),
      queryInterface.changeColumn('Booking', 'endDate', {
        type: Sequelize.DATEONLY,
        allowNull: false,
      }),
      queryInterface.changeColumn('Booking', 'endTime', {
        type: Sequelize.DATE,
        allowNull: false,
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([])
  }
};
