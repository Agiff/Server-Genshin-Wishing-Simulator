const router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/register', userController.register);

module.exports = router;