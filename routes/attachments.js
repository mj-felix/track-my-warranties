const s3Proxy = require("s3-proxy");
const express = require("express");
const router = express.Router();
const { isLoggedIn, fileBelongsToUser } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

router.get(
  "/:fileKey",
  isLoggedIn,
  catchAsync(fileBelongsToUser),
  s3Proxy({
    bucket: process.env.S3_BUCKET,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_ACCESS_SECRET,
    overrideCacheControl: "max-age=100000",
  })
);

module.exports = router;
