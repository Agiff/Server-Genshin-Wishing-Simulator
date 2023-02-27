'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Banner.belongsTo(models.User);
    }
  }
  Banner.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING
    },
    rateUpGold: {
      allowNull: false,
      type: DataTypes.STRING
    },
    rateUpPurple1: {
      allowNull: false,
      type: DataTypes.STRING
    },
    rateUpPurple2: {
      allowNull: false,
      type: DataTypes.STRING
    },
    rateUpPurple3: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Banner',
  });
  return Banner;
};