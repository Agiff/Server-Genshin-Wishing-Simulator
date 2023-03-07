const router = require('express').Router();
const GachaController = require('../controllers/gachaController');
const { authentication } = require('../middlewares/authentication');

router.get('/banners', GachaController.showBanner);
router.get('/banners/:id', GachaController.showBannerById);
router.get('/limited/:bannerId', authentication, GachaController.startGachaLimitedCharacter);
router.get('/limited/:bannerId/10x', authentication, GachaController.startGachaLimitedCharacter10x);

module.exports = router;