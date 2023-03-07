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

  static async updateInventory(req, res, next) {
    try {
      const { type } = req.params;
      const { primogem, intertwined_fate, acquaint_fate } = req.body;

      const currentInventory = await Inventory.findByPk(req.user.id);
      if (!currentInventory) throw { name: 'NotFound' };
      
      let option = {};

      if (type === 'inc') {
        if (primogem) option.primogem = currentInventory.primogem + +primogem;
        if (intertwined_fate) option.intertwined_fate = currentInventory.intertwined_fate + +intertwined_fate;
        if (acquaint_fate) option.acquaint_fate = currentInventory.acquaint_fate + +acquaint_fate;
      } else {
        if (primogem) option.primogem = currentInventory.primogem - +primogem;
        if (intertwined_fate) option.intertwined_fate = currentInventory.intertwined_fate - +intertwined_fate;
        if (acquaint_fate) option.acquaint_fate = currentInventory.acquaint_fate - +acquaint_fate;
      }

      await currentInventory.update(option);
      
      res.status(200).json({ message: 'Inventory updated' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = InventoryController;