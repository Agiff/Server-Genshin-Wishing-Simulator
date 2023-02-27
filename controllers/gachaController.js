const { User, Inventory } = require('../models');

class GachaController {
  static async startGacha (req, res, next) {
    try {
      const rate = 100000;
      const gold = 600;
      const purple = 5100;

      const result = Math.ceil(Math.random() * rate);
      
      let message = 'You won a 3 star';

      if (result <= purple) message = 'You won a 4 star';
      if (result <= gold) message = 'You won a 5 star';

      res.status(200).json({ message, result })
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GachaController;