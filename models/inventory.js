'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Inventory.belongsTo(models.User);
      Inventory.hasMany(models.Character);
      Inventory.hasMany(models.Weapon);
    }
  }
  Inventory.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'The owner is missing' },
        notEmpty: { msg: 'The owner is missing' }
      }
    },
  }, {
    sequelize,
    modelName: 'Inventory',
  });
  return Inventory;
};