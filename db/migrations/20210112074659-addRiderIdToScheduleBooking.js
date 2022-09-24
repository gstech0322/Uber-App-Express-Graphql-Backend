'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('ScheduleBooking', 'riderId', {
        type: Sequelize.UUID
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('ScheduleBooking', 'riderId')
    ]);
  }
};
