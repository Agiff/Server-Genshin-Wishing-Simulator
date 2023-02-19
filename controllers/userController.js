const { User } = require('../models');

class userController {
  static home(req, res) {
    res.send('home');
  }

  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const createdUser = await User.create({ username, email, password });
      res.status(201).json(createdUser);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = userController;