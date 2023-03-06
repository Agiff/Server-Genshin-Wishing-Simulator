const router = require('express').Router();
const CharacterController = require('../controllers/characterController');

router.get('/fiveStars', CharacterController.showFiveStarCharacter);
router.get('/fourStars', CharacterController.showFourStarCharacter);

module.exports = router;