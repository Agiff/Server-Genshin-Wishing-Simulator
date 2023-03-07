const { Inventory, User } = require('../models');

const inventoryAuthorization = async (req, res, next) => {
  try {
    const currentInventory = await Inventory.findByPk(req.user.id);
    if (!currentInventory) throw { name: 'NotFound' };

    if (req.user.id !== currentInventory.UserId) throw { name: 'Forbidden' }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { inventoryAuthorization }