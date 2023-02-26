const router = require('express').Router();
const inventoryController = require('../controllers/inventoryController');
const { inventoryAuthorization } = require('../middlewares/authorization');

router.get('/', inventoryController.showInventory);
router.get('/:id', inventoryController.findInventory);
router.patch('/:id', inventoryAuthorization, inventoryController.updateInventory);

module.exports = router;