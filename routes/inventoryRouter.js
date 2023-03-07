const router = require('express').Router();
const InventoryController = require('../controllers/inventoryController');
const { inventoryAuthorization } = require('../middlewares/authorization');

router.get('/', InventoryController.showInventory);
router.patch('/update/:type', inventoryAuthorization, InventoryController.updateInventory);

module.exports = router;