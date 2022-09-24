'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Category', 'riderFeeType', {
        type: Sequelize.ENUM('fixed', 'percentage'),
        allowNull: true,
      }),
      queryInterface.changeColumn('Category', 'riderFeeValue', {
        type: Sequelize.FLOAT,
        allowNull: true,
      }),
      queryInterface.changeColumn('Category', 'driverFeeType', {
        type: Sequelize.ENUM('fixed', 'percentage'),
        allowNull: true,
      }),
      queryInterface.changeColumn('Category', 'driverFeeValue', {
        type: Sequelize.FLOAT,
        allowNull: true,
      }),
      queryInterface.changeColumn('Category', 'capacity', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Category', 'riderFeeType'),
      queryInterface.removeColumn('Category', 'riderFeeValue'),
      queryInterface.removeColumn('Category', 'driverFeeType'),
      queryInterface.removeColumn('Category', 'driverFeeValue'),
      queryInterface.removeColumn('Category', 'capacity'),
    ])
  }
};
