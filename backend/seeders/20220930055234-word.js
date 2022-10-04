'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {


    await queryInterface.bulkInsert('words', [{
      english: 'abandon',
      chinese: '放弃、抛弃',
      click_time: 0,
      classes: 'v',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('words', null, {});

  }
};
