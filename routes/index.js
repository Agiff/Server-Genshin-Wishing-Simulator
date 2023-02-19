const router = require('express').Router();
const userController = require('../controllers/userController');
const userRouter = require('./userRouter');

router.get('/', userController.home);

router.use('/users', userRouter);

module.exports = router;