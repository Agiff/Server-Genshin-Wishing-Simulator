const router = require('express').Router();
const userController = require('../controllers/userController');
const errorHandler = require('../middlewares/errorHandler');
const userRouter = require('./userRouter');
const inventoryRouter = require('./inventoryRouter');
const { authentication } = require('../middlewares/authentication');

router.get('/', userController.home);

router.use('/users', userRouter);
router.use('/inventories', authentication, inventoryRouter);
router.use(errorHandler);

module.exports = router;