const router = require('express').Router();
const UserController = require('../controllers/userController');
const errorHandler = require('../middlewares/errorHandler');
const UserRouter = require('./userRouter');
const InventoryRouter = require('./inventoryRouter');
const GachaRouter = require('./gachaRouter');
const CharacterRouter = require('./characterRouter');
const { authentication } = require('../middlewares/authentication');

router.get('/', UserController.home);

router.use('/users', UserRouter);
router.use('/characters', CharacterRouter);
router.use('/gachas', GachaRouter);
router.use('/inventories', authentication, InventoryRouter);
router.use(errorHandler);

module.exports = router;