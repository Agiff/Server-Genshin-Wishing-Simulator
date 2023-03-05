'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FourStarWeapon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FourStarWeapon.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    limited: DataTypes.BOOLEAN,
    available: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'FourStarWeapon',
  });
  return FourStarWeapon;
};