/* eslint-disable no-undef */
/* eslint-disable no-unused-vars*/
const express = require('express');
const { signup, login, signupAdmin } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

/* eslint-enable no-undef */
/* eslint-enable no-unused-vars */
module.exports = router;
