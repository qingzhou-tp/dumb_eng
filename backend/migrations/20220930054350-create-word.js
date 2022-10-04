'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('words', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      english: {
        type: Sequelize.STRING
      },
      chinese: {
        type: Sequelize.STRING
      },
      classes: {
        type: Sequelize.STRING
      },
      click_time: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('words');
  }
};