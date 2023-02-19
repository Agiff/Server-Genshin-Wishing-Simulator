const router = require('express').Router();
const characterController = require('../controllers/characterController');

router.get('/', characterController.showCharacter);

module.exports = router;