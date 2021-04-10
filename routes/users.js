const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');

router.route('/')
    .get(isLoggedIn, users.showUser)
    .patch(isLoggedIn, catchAsync(users.updateUser));

router.get('/edit', isLoggedIn, users.renderEditForm)

module.exports = router;