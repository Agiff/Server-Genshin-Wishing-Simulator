const router = require('express').Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/', inventoryController.showInventory);
router.get('/:id', inventoryController.findInventory);

module.exports = router;