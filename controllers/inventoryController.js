const { User, Inventory, Character, Weapon } = require('../models');

class InventoryController {
  static async showInventory(req, res, next) {
    try {
      const inventories = await Inventory.findOne({
        include: [Character, Weapon],
        where: { UserId: req.user.id }
      });
      res.status(200).json(inventories);
    } catch (error) {
      next(error);
    }
  }

  static async buyFates(req, res, next) {
    try {
      const { intertwined_fate, acquaint_fate } = req.body;

      const currentInventory = await Inventory.findByPk(req.user.id);
      if (!currentInventory) throw { name: 'NotFound' };

      let price = 0;
      if (intertwined_fate) price = +intertwined_fate * 160;
      if (acquaint_fate) price = +acquaint_fate * 160;
      if (currentInventory.primogem < price) throw { name: 'NotEnoughCurrency' };

      let option = {};
      option.primogem = currentInventory.primogem - price;

      if (intertwined_fate) option.intertwined_fate = currentInventory.intertwined_fate + +intertwined_fate;
      if (acquaint_fate) option.acquaint_fate = currentInventory.acquaint_fate + +acquaint_fate;

      await currentInventory.update(option);
      
      res.status(200).json({ message: 'Purchase success' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = InventoryController;