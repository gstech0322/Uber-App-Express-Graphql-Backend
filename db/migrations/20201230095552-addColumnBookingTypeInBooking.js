'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Booking', 'bookingType',{
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Booking','bookingType')
    ])
  }
};
