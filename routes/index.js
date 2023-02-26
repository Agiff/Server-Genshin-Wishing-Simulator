const router = require('express').Router();
const UserController = require('../controllers/userController');
const errorHandler = require('../middlewares/errorHandler');
const UserRouter = require('./userRouter');
const InventoryRouter = require('./inventoryRouter');
const GachaRouter = require('./gachaRouter');
const { authentication } = require('../middlewares/authentication');

router.get('/', UserController.home);

router.use('/users', UserRouter);
router.use('/inventories', authentication, InventoryRouter);
router.use('/gachas', authentication, GachaRouter);
router.use(errorHandler);

module.exports = router;