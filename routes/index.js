const router = require('express').Router();
const userController = require('../controllers/userController');
const errorHandler = require('../middlewares/errorHandler');
const userRouter = require('./userRouter');
const characterRouter = require('./characterRouter');

router.get('/', userController.home);

router.use('/users', userRouter);
router.use('/characters', characterRouter);
router.use(errorHandler);

module.exports = router;