const express = require('express');
const router = express.Router();
const { isLoggedIn, validateUser } = require('../middleware');
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');

router.route('/')
    .get(isLoggedIn, catchAsync(users.showUser))
    .patch(isLoggedIn, validateUser, catchAsync(users.updateUser));

router.get('/edit', isLoggedIn, users.renderEditForm)

module.exports = router;