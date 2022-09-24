'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Booking', 'notes', {
        type: Sequelize.TEXT,
        allowNull: true
      })
    ])  
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Booking', 'notes')
    ])
  }
};
