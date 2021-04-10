const express = require('express');
const router = express.Router();
const { isLoggedIn, isOwner, validateEntry } = require('../middleware');
const entries = require('../controllers/entries');
const files = require('../controllers/files');
const catchAsync = require('../utils/catchAsync');


router.get('/new', isLoggedIn, entries.renderNewForm)


router.route('/')
    .get(isLoggedIn, catchAsync(entries.index))
    .post(isLoggedIn, validateEntry, catchAsync(entries.createEntry));



router.route('/:id')
    .get(isLoggedIn, isOwner, catchAsync(entries.showEntry))
    .delete(isLoggedIn, isOwner, catchAsync(entries.deleteEntry))
    .patch(isLoggedIn, isOwner, validateEntry, catchAsync(entries.updateEntry));

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(entries.renderEditForm));



// router.route('/:id/files')
//     .post(uploadS3.single('file'), catchAsync(files.uploadFile));


module.exports = router;