const express = require('express');
const router = express.Router();
const { isLoggedIn, isOwner, fileBelongsToEntry } = require('../middleware');
const files = require('../controllers/files');
const catchAsync = require('../utils/catchAsync');
uuid = require('uuid');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_ACCESS_SECRET
});

const uploadS3 = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: process.env.S3_BUCKET,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname })
        },
        key: (req, file, cb) => {
            cb(null, uuid.v4() + '-' + file.originalname.replace(/[^\.a-zA-Z0-9_-]/g, ''));
        }
    })
});

router.post('/:id/files', isLoggedIn, isOwner, uploadS3.single('file'), catchAsync(files.uploadFile));

router.delete('/:id/files/:fileKey', isLoggedIn, isOwner, fileBelongsToEntry, catchAsync(files.deleteFile));

module.exports = router;