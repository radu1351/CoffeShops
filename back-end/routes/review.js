const express = require('express');
const reviewRouter = express.Router();
const reviewController = require('../controllers/review');
const authGuard = require('../controllers/middleware');
const router = require('.');

reviewRouter.post("/generateReviews/:reviews_amount", authGuard.tokenGuard, reviewController.generateFakecoffeShopReviews);
reviewRouter.get("/getAllReviews/:coffeShop_id", reviewController.getAllReviewsBycoffeShop);

module.exports = reviewRouter;