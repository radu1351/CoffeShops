const express = require('express');
const coffeShopRouter = express.Router();
const coffeShopController = require('../controllers/coffeShop');
const authGuard = require('../controllers/middleware');

coffeShopRouter.get("/getAllcoffeShops", coffeShopController.getAllcoffeShops);
coffeShopRouter.get("/getcoffeShop/:coffeShop_id", coffeShopController.getcoffeShop);
coffeShopRouter.post("/generatecoffeShops/:coffeShops_amount", authGuard.tokenGuard, coffeShopController.generateFakecoffeShopsData);
coffeShopRouter.put("/editcoffeShop/:coffeShop_id", authGuard.tokenGuard, coffeShopController.editcoffeShop);
coffeShopRouter.delete("/deletecoffeShop/:coffeShop_id", authGuard.tokenGuard, coffeShopController.deletecoffeShop);
module.exports = coffeShopRouter;