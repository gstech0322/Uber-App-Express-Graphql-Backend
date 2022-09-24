'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn('Vehicles', 'vehicleModel', {
                    type: Sequelize.STRING
                }, {transaction: t}),
                queryInterface.addColumn('Vehicles', 'vehicleColor', {
                    type: Sequelize.STRING,
                }, {transaction: t})
            ])
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn('Vehicles', 'vehicleModel', {transaction: t}),
                queryInterface.removeColumn('Vehicles', 'vehicleColor', {transaction: t})
            ])
        })
    }
};
