const {
  User,
  Inventory,
  Character,
  FiveStarCharacter,
  FourStarCharacter
} = require('../models');

class CharacterController {
  static async showFiveStarCharacter(req, res, next) {
    try {
      const characters = await FiveStarCharacter.findAll();
      res.status(200).json(characters);
    } catch (error) {
      next(error);
    }
  }
  
  static async showFourStarCharacter(req, res, next) {
    try {
      const characters = await FourStarCharacter.findAll();
      res.status(200).json(characters);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CharacterController;