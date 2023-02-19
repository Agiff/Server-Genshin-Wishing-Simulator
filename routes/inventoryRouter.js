const router = require('express').Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/', inventoryController.showInventory);

module.exports = router;