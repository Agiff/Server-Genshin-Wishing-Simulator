const { comparePassword } = require('../helpers/bcrypt');
const { createToken } = require('../helpers/jwt');
const { User, Inventory } = require('../models');

class UserController {
  static home(req, res) {
    res.send('home');
  }

  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const createdUser = await User.create({ username, email, password });
      await Inventory.create({ 
        UserId: createdUser.id,
        primogem: 0,
        intertwined_fate: 0,
        acquaint_fate: 0,
        starglitter: 0
      })
      res.status(201).json({
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { emailUsername, password } = req.body;
      if (!emailUsername || !password) throw { name: 'UsernameEmailPasswordRequired' };

      let userFound;
      userFound = await User.findOne({ where: { username: emailUsername } });
      if (!userFound) userFound = await User.findOne({ where: { email: emailUsername } });
      if (!userFound) throw { name: 'UsernameEmailPasswordInvalid' };

      const verifiedPassword = comparePassword(password, userFound.password);
      if (!verifiedPassword) throw { name: 'UsernameEmailPasswordInvalid' };

      const payload = { id: userFound.id };
      const access_token = createToken(payload);

      res.send({ access_token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;