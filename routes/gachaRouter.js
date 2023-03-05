const router = require('express').Router();
const GachaController = require('../controllers/gachaController');

router.get('/:bannerId', GachaController.startGachaLimitedCharacter);

module.exports = router;