const { Inventory } = require('../models');

class inventoryController {
  static async showInventory(req, res, next) {
    try {
      const inventories = await Inventory.findAll();
      res.send(inventories);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = inventoryController;