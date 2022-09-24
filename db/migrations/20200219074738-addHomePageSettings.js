'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query('TRUNCATE TABLE HomePage'),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Home Section Image 1','homeSectionImage1', '1', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Home Section Image 2','homeSectionImage2', '2', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Home Section Image 3','homeSectionImage3', '3', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Home Section Image 4','homeSectionImage4', '4', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Home Section Image 5','homeSectionImage5', '5', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Home Section Image 6','homeSectionImage6', '6', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Home Section Button 1','homeSectionButton1', '1', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Home Section Title 1','homeSectionTitle1', '1', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('City Section Title 1','citySectionTitle1', '1', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('City Section Content 1','citySectionContent1', '1', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('About Grid Image 1','aboutGridImage1', '1', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('About Grid Image 2','aboutGridImage2', '2', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('About Grid Title 1','aboutGridTitle1', '1', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('About Grid Title 2','aboutGridTitle2', '2', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('About Grid Title 3','aboutGridTitle3', '3', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('About Grid Title 4','aboutGridTitle4', '4', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('About Grid Title 5','aboutGridTitle5', '5', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('About Grid Title 6','aboutGridTitle6', '6', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('About Grid Content 1','aboutGridContent1', '1', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('About Grid Content 2','aboutGridContent2', '2', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('About Grid Content 3','aboutGridContent3', '3', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('About Grid Content 4','aboutGridContent4', '4', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('About Grid Content 5','aboutGridContent5', '5', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('About Grid Content 6','aboutGridContent6', '6', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Safety Grid Title 1','safetyGridTitle1', '1', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Safety Grid Content 1','safetyGridContent1', '1', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Safety Grid Image 1','safetyGridImage1', '1', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Safety Grid Image 2','safetyGridImage2', '2', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Safety Grid Image 3','safetyGridImage3', '3', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Signup Grid Image 1','signupGridImage1', '1', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Signup Grid Image 2','signupGridImage2', '2', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Signup Grid Image 3','signupGridImage3', '3', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Signup Grid Title 1','signupGridTitle1', '1', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Signup Grid Content 1','signupGridContent1', '1', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Footer Title 1','footerTitle1', '1', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Footer Content 1','footerContent1', '1', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Footer Logo 1','footerLogo1', '1', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Footer Logo 2','footerLogo2', '2', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Footer Logo 3','footerLogo3', '3', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Footer Logo 4','footerLogo4', '4', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Footer Link 1','footerLink1', '1', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Footer Link 2','footerLink2', '2', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Footer Link 3','footerLink3', '3', NOW(), NOW())"),
      queryInterface.sequelize.query("INSERT INTO HomePage (`title`, `name`, `value`, `createdAt`, `updatedAt`) VALUES ('Footer Link 4','footerLink4', '4', NOW(), NOW())"),
      
    ])
  },

  down: (queryInterface, Sequelize) => {
    return true;
  }
};
