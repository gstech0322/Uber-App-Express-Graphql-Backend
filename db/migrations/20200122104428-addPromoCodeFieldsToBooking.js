'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Booking', 'promoCodeId', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('Booking', 'isSpecialTrip', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }),
      queryInterface.addColumn('Booking', 'specialTripPrice', {
        type: Sequelize.FLOAT,
        defaultValue: 0
      }),
      queryInterface.addColumn('Booking', 'specialTripTotalFare', {
        type: Sequelize.FLOAT,
        defaultValue: 0
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Booking', 'promoCodeId'),
      queryInterface.removeColumn('Booking', 'isSpecialTrip'),
      queryInterface.removeColumn('Booking', 'specialTripPrice'),
      queryInterface.removeColumn('Booking', 'specialTripTotalFare')
    ])
  }
};
