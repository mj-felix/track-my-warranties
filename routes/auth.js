const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const auth = require('../controllers/auth');
const { validateUser } = require('../middleware');

router.route('/register')
    .get(auth.renderRegister)
    .post(validateUser, catchAsync(auth.register));

router.route('/login')
    .get(auth.renderLogin)
    .post(validateUser, passport.authenticate('local', { failureFlash: 'Invalid email or password.', failureRedirect: '/login' }), catchAsync(auth.login))

router.get('/logout', auth.logout)

module.exports = router;