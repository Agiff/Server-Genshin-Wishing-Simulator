const router = require('express').Router();
const GachaController = require('../controllers/gachaController');

router.get('/', GachaController.startGacha);

module.exports = router;