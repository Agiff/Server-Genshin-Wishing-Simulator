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
        acquaint_fate: 0
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
      const { username, email, password } = req.body;
      if (!username && !email || !password) throw { name: 'UsernameEmailPasswordRequired' };

      let option;
      if (username) option = { where: { username } };
      else if (email) option = { where: { email } };
      const userFound = await User.findOne(option);
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