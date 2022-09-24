'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query('TRUNCATE TABLE Currencies'),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('AUD',1,0,1,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('BGN',1,0,1,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('BRL',1,0,1,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('CAD',1,0,0,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('CHF',1,0,0,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('CNY',1,0,0,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('CZK',1,0,0,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('DKK',1,0,0,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('EUR',1,0,1,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('GBP',1,0,0,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('HKD',1,0,0,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('HRK',1,0,0,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('HUF',1,0,0,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('IDR',1,0,0,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('ILS',1,0,0,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('INR',1,0,0,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('JPY',1,0,0,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('KRW',1,0,0,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('MXN',1,0,0,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('MYR',1,0,0,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('NOK',1,0,0,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('NZD',1,0,0,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('PHP',1,0,1,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('PLN',1,0,0,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('RON',1,0,0,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('RUB',1,0,1,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('SEK',1,0,0,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('SGD',1,0,1,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('THB',1,0,1,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('TRY',1,0,1,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('USD',1,1,1,NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO Currencies (`symbol`, `isEnable`, `isBaseCurrency`, `isPayment`, `createdAt`, `updatedAt`) VALUES ('ZAR',1,0,1,NOW(), NOW())"),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return true;
  }
};
