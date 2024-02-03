const express = require('express');
const router = express.Router();
const jwtAuthController = require('../controllers/jwt-auth');

router.post('/register', jwtAuthController.registerUser);
router.post('/login', jwtAuthController.loginUser);

module.exports = router;