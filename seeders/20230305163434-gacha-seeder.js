'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const threeStars = require('../data/3-stars.json').map(el => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    })

    const fourStarCharacters = require('../data/4-stars-characters.json').map(el => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    })

    const fourStarWeapons = require('../data/4-stars-weapons.json').map(el => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    })

    const fiveStarCharacters = require('../data/5-stars-characters.json').map(el => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    })

    const fiveStarWeapons = require('../data/5-stars-weapons.json').map(el => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    })

    await queryInterface.bulkInsert('ThreeStars', threeStars, {});
    await queryInterface.bulkInsert('FourStarCharacters', fourStarCharacters, {});
    await queryInterface.bulkInsert('FourStarWeapons', fourStarWeapons, {});
    await queryInterface.bulkInsert('FiveStarCharacters', fiveStarCharacters, {});
    await queryInterface.bulkInsert('FiveStarWeapons', fiveStarWeapons, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('ThreeStars', null, {});
    await queryInterface.bulkDelete('FourStarCharacters', null, {});
    await queryInterface.bulkDelete('FourStarWeapons', null, {});
    await queryInterface.bulkDelete('FiveStarCharacters', null, {});
    await queryInterface.bulkDelete('FiveStarWeapons', null, {});
  }
};
