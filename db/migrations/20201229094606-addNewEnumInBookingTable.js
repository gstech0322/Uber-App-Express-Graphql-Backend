'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Booking', 'tripstatus', {
                type: Sequelize.ENUM('created', 'approved', 'declined', 'started', 'cancelledByRider', 'cancelledByDriver', 'completed', 'expired', 'scheduled'),
                allowNull: false
            })
        ])
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Booking', 'tripstatus', {
                type: Sequelize.ENUM('created', 'approved', 'declined', 'started', 'cancelledByRider', 'cancelledByDriver', 'completed', 'expired'),
                allowNull: false
            })
        ])
    }
};