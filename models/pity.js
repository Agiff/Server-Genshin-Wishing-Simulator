'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Pity.belongsTo(models.User);
    }
  }
  Pity.init({
    charLimitedGoldPity: DataTypes.INTEGER,
    charLimitedPurplePity: DataTypes.INTEGER,
    weaponLimitedGoldPity: DataTypes.INTEGER,
    weaponLimitedPurplePity: DataTypes.INTEGER,
    standardGoldPity: DataTypes.INTEGER,
    standardPurplePity: DataTypes.INTEGER,
    guaranteedCharacter: DataTypes.INTEGER,
    guaranteedWeapon: DataTypes.INTEGER,
    fatePoint: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Pity',
  });
  return Pity;
};