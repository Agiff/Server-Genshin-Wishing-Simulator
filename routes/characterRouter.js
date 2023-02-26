const router = require('express').Router();
const InventoryController = require('../controllers/inventoryController');

router.get('/', InventoryController.showInventory);
router.get('/:id', InventoryController.findInventory);

module.exports = router;