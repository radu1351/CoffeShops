const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user');
const authGuard = require('../controllers/middleware');

userRouter.get("/getCurrentUser/:uid", authGuard.tokenGuard, userController.getCurrentUser);
userRouter.post("/generateUsers/:users_amount", authGuard.tokenGuard, userController.generateFakeUserData);
userRouter.post("/addReview/:coffeShop_id", authGuard.tokenGuard, userController.addReview);
userRouter.delete('/deleteReview/:coffeShop_id', authGuard.tokenGuard, userController.deleteReview);
userRouter.put('/editReview/:coffeShop_id', authGuard.tokenGuard, userController.editReview);
userRouter.put('/updateUser/:uid', authGuard.tokenGuard, userController.updateUser);

module.exports = userRouter;