'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('User', 'overallRating', {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0
      })   
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('User', 'overallRating')
    ])
  }
};
