const express = require('express');
const router = express.Router();
const userRouter = require('./user');
const authRouter = require('./jwt-auth');
const coffeShopRouter = require('./coffeShop');
const reviewRouter = require('./review');

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/coffeShops', coffeShopRouter);
router.use('/review', reviewRouter);

module.exports = router;