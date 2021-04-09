const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');

router.route('/')
    .get(users.showUser)
    .patch(catchAsync(users.updateUser));

router.get('/edit', users.renderEditForm)

module.exports = router;