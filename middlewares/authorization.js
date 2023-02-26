const { Inventory, User } = require('../models');

const inventoryAuthorization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentInventory = await Inventory.findByPk(id);
    if (!currentInventory) throw { name: 'NotFound' };

    if (req.user.id !== currentInventory.UserId) throw { name: 'Forbidden' }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { inventoryAuthorization }