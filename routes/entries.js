const express = require('express');
const router = express.Router();
const { isLoggedIn, isOwner } = require('../middleware');
const entries = require('../controllers/entries');
const files = require('../controllers/files');
const catchAsync = require('../utils/catchAsync');
// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const AWS = require('aws-sdk');

// const s3 = new AWS.S3({
//     accessKeyId: process.env.S3_ACCESS_KEY,
//     secretAccessKey: process.env.S3_ACCESS_SECRET
// });

// const uploadS3 = multer({
//     storage: multerS3({
//         s3: s3,
//         acl: 'public-read',
//         bucket: process.env.S3_BUCKET,
//         metadata: (req, file, cb) => {
//             cb(null, { fieldName: file.fieldname })
//         },
//         key: (req, file, cb) => {
//             cb(null, Date.now().toString() + '-' + file.originalname)
//         }
//     })
// });


//const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
// const multer = require('multer');
// const { storage } = require('../cloudinary');
// const upload = multer({ storage });

// const Entry = require('../models/entry');

// router.route('/')
//     .get(catchAsync(campgrounds.index))
//     .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))


router.get('/new', isLoggedIn, entries.renderNewForm)
// router.get('/entries/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/')
    .get(isLoggedIn, catchAsync(entries.index))
    .post(isLoggedIn, catchAsync(entries.createEntry));
// .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
// .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


router.route('/:id')
    .get(isLoggedIn, isOwner, catchAsync(entries.showEntry))
    .delete(isLoggedIn, isOwner, catchAsync(entries.deleteEntry))
    .patch(isLoggedIn, isOwner, catchAsync(entries.updateEntry));

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(entries.renderEditForm));



// router.route('/:id/files')
//     .post(uploadS3.single('file'), catchAsync(files.uploadFile));


module.exports = router;