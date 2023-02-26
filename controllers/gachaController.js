const { User, Inventory } = require('../models');

class GachaController {
  static async startGacha (req, res, next) {
    try {
      console.log('standard');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GachaController;