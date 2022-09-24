'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('User', 'activeStatus', {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
      }), 
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('User', 'activeStatus')
    ])
  }
};
