const router = require('express').Router();
const inventoryController = require('../controllers/inventoryController');
const { inventoryAuthorization } = require('../middlewares/authorization');

router.get('/', inventoryController.showInventory);
router.get('/:id', inventoryAuthorization, inventoryController.findInventory);

module.exports = router;