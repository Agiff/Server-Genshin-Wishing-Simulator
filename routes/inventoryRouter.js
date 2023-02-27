const router = require('express').Router();
const InventoryController = require('../controllers/inventoryController');
const { inventoryAuthorization } = require('../middlewares/authorization');

router.get('/', InventoryController.showInventory);
router.get('/:id', InventoryController.findInventory);
router.patch('/:id/:type', inventoryAuthorization, InventoryController.updateInventory);

module.exports = router;