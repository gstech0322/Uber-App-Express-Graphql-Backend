'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   
   return Promise.all([
    queryInterface.addColumn('UserProfile', 'paymentMethodId', {
      type: Sequelize.STRING
    }),

    // queryInterface.addColumn('UserProfile', 'paymentIntentStatus', {
    //   type: Sequelize.ENUM('completed', 'incompleted'),
    //   defaultValue: 'incompleted'
    // }),

    // queryInterface.addColumn('UserProfile', 'three_d_secure', {
    //   type: Sequelize.BOOLEAN,
    //   defaultValue: false
    // }),
  ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
