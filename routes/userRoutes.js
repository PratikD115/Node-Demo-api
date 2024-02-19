const express = require('express');
const authController = require('./../constrollers/authController')

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;