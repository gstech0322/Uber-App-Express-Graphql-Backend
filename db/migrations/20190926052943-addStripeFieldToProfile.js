'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('UserProfile', 'cardLastFour', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('UserProfile', 'cardToken', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('UserProfile', 'sourceId', {
        type: Sequelize.STRING
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('UserProfile', 'cardLastFour'),
      queryInterface.removeColumn('UserProfile', 'cardToken'),
      queryInterface.removeColumn('UserProfile', 'sourceId')
    ])
  }
};
