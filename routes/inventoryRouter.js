const router = require('express').Router();
const InventoryController = require('../controllers/inventoryController');
const { inventoryAuthorization } = require('../middlewares/authorization');

router.get('/', InventoryController.showInventory);
router.put('/buy', inventoryAuthorization, InventoryController.buyFates);
router.patch('/topup', inventoryAuthorization, InventoryController.topup);

module.exports = router;