const router = require('express').Router();
const userController = require('../controllers/userController');
const errorHandler = require('../middlewares/errorHandler');
const userRouter = require('./userRouter');
const inventoryRouter = require('./inventoryRouter');

router.get('/', userController.home);

router.use('/users', userRouter);
router.use('/inventories', inventoryRouter);
router.use(errorHandler);

module.exports = router;