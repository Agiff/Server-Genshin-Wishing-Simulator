class characterController {
  static async showCharacter(req, res, next) {
    try {
      res.send('character');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = characterController;