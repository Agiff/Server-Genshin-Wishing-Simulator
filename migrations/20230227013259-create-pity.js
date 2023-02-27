'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      charLimitedGoldPity: {
        type: Sequelize.INTEGER
      },
      charLimitedPurplePity: {
        type: Sequelize.INTEGER
      },
      weaponLimitedGoldPity: {
        type: Sequelize.INTEGER
      },
      weaponLimitedPurplePity: {
        type: Sequelize.INTEGER
      },
      standardGoldPity: {
        type: Sequelize.INTEGER
      },
      standardPurplePity: {
        type: Sequelize.INTEGER
      },
      guaranteedGoldCharacter: {
        type: Sequelize.BOOLEAN
      },
      guaranteedPurpleCharacter: {
        type: Sequelize.BOOLEAN
      },
      guaranteedGoldWeapon: {
        type: Sequelize.BOOLEAN
      },
      guaranteedPurpleWeapon: {
        type: Sequelize.BOOLEAN
      },
      fatePoint: {
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        allowNull: false,
        onDelete: 'cascade',
        onUpdate: 'cascade'
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Pities');
  }
};