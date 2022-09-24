'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Booking', 'currency', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'USD'
      })   
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Booking', 'currency')   
    ])
  }
};
