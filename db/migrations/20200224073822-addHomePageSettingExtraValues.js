'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
return Promise.all([
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Safety Grid Link 1','safetyGridLink1', '3', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Safety Grid Link 2','safetyGridLink2', '3', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Signup Grid Link 1','signupGridLink1', '3', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Signup Grid Link 2','signupGridLink2', '3', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Footer Link Name 1','footerLinkName1', '1', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Footer Link Name 2','footerLinkName2', '2', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Footer Link Name 3','footerLinkName3', '3', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Footer Link Name 4','footerLinkName4', '4', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Footer Link Title','footerLinkTitle', '4', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Footer Bottom','footerBottom', '4', NOW(), NOW())")
])
      
  },

  down: (queryInterface, Sequelize) => {
    return true;
  }
};
