'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FiveStarCharacter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FiveStarCharacter.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    limited: DataTypes.BOOLEAN,
    available: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'FiveStarCharacter',
  });
  return FiveStarCharacter;
};