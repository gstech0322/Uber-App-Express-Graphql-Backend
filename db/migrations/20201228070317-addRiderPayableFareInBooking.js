'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Booking','riderPayableFare',{
        type: Sequelize.FLOAT 
      })
    ])
    
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
    queryInterface.removeColumn('Booking','riderPayableFare',{
      type: Sequelize.FLOAT 
    })
  ])
    
  }
};
