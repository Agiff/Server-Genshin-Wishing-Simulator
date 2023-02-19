const { Character } = require('../models');

class characterController {
  static async showCharacter(req, res, next) {
    try {
      const characters = await Character.findAll();
      res.send(characters);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = characterController;