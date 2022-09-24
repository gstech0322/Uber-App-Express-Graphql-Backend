'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('CancelReason', 'isActive', {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('CancelReason', 'isActive')
    ])
  }
};
