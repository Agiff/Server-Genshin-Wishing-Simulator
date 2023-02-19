const { User } = require('../models');

class userController {
  static home(req, res) {
    res.send('home');
  }

  static async register(req, res, next) {
    res.send('register');
  }
}

module.exports = userController;