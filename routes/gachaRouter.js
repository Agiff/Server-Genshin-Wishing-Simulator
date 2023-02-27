const router = require('express').Router();
const GachaController = require('../controllers/gachaController');

router.get('/:bannerId', GachaController.startGacha);

module.exports = router;