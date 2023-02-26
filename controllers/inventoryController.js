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

  static async findInventory(req, res, next) {
    try {
      const { id } = req.params;
      const inventory = await Inventory.findByPk(id, {
        include: [Character, Weapon]
      })
      if (!inventory) throw { name: 'NotFound' };
      res.status(200).json(inventory);
    } catch (error) {
      next(error);
    }
  }

  static async updateInventory(req, res, next) {
    try {
      const { id } = req.params;
      const { primogem, intertwined_fate, acquaint_fate, type } = req.body;

      const currentInventory = await Inventory.findByPk(id);
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

module.exports = inventoryController;