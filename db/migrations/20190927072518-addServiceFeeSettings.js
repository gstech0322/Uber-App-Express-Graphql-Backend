'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Category', 'riderFeeType', {
        type: Sequelize.ENUM('fixed', 'percentage'),
      }),
      queryInterface.addColumn('Category', 'riderFeeValue', {
        type: Sequelize.FLOAT,
      }),
      queryInterface.addColumn('Category', 'driverFeeType', {
        type: Sequelize.ENUM('fixed', 'percentage'),
      }),
      queryInterface.addColumn('Category', 'driverFeeValue', {
        type: Sequelize.FLOAT,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Category', 'riderFeeType'),
      queryInterface.removeColumn('Category', 'riderFeeValue'),
      queryInterface.removeColumn('Category', 'driverFeeType'),
      queryInterface.removeColumn('Category', 'driverFeeValue')
    ])
  }
};
