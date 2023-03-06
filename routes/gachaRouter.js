const router = require('express').Router();
const GachaController = require('../controllers/gachaController');

router.get('/limited/:bannerId', GachaController.startGachaLimitedCharacter);

module.exports = router;