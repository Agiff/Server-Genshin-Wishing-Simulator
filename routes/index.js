const router = require('express').Router();
const userController = require('../controllers/userController');
const errorHandler = require('../middlewares/errorHandler');
const userRouter = require('./userRouter');

router.get('/', userController.home);

router.use('/users', userRouter);
router.use(errorHandler);

module.exports = router;