const { comparePassword } = require('../helpers/bcrypt');
const { createToken } = require('../helpers/jwt');
const { User, Inventory } = require('../models');
const midtransClient = require('midtrans-client');

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

  static async createMidtransToken(req, res, next) {
    try {
      const { price } = req.body;

      let snap = new midtransClient.Snap({
          // Set to true if you want Production Environment (accept real transaction).
          isProduction : false,
          serverKey : process.env.MIDTRANS_SECRET_KEY
      });

      let parameter = {
        "transaction_details": {
          "order_id": "TRANSACTION_" + Math.ceil(Math.random() * 10000000 + 1000000),
          "gross_amount": price //total harga
        },
        "credit_card":{
          "secure" : true
        },
        "customer_details": {
          "email": "budi.pra@example.com",
        }
      };

      const midtransToken = await snap.createTransaction(parameter);
      res.status(200).json(midtransToken);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;