const s3Proxy = require("s3-proxy");
const express = require("express");
const router = express.Router();
const { isLoggedIn, fileBelongsToUser } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

const s3ProxyConfig = {
  bucket: process.env.S3_BUCKET,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_ACCESS_SECRET,
  overrideCacheControl: "max-age=100000",
};

if (s3ProxyConfig.accessKeyId === "minioadmin") {
  s3ProxyConfig.endpoint = `http://s3mock:${process.env.S3MOCK_PORT}`;
  s3ProxyConfig.s3ForcePathStyle = true;
}

router.get(
  "/:fileKey",
  isLoggedIn,
  catchAsync(fileBelongsToUser),
  s3Proxy(s3ProxyConfig)
);

module.exports = router;
