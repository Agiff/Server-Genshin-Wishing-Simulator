'use strict';

const { hashPassword } = require('../helpers/bcrypt');

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
    const users = require('../data/users.json').map(el => {
      el.password = hashPassword(el.password);
      el.createdAt = el.updatedAt = new Date();
      return el;
    })

    const inventories = require('../data/inventories.json').map(el => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    })

    const characters = require('../data/characters.json').map(el => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    })

    const weapons = require('../data/weapons.json').map(el => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    })

    await queryInterface.bulkInsert('Users', users, {});
    await queryInterface.bulkInsert('Inventories', inventories, {});
    await queryInterface.bulkInsert('Characters', characters, {});
    await queryInterface.bulkInsert('Weapons', weapons, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Inventories', null, {});
    await queryInterface.bulkDelete('Characters', null, {});
    await queryInterface.bulkDelete('Weapons', null, {});
  }
};
