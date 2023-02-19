const { User, Inventory, Character, Weapon } = require('../models');

class inventoryController {
  static async showInventory(req, res, next) {
    try {
      const inventories = await Inventory.findAll({
        include: User
      });
      res.status(200).json(inventories);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = inventoryController;