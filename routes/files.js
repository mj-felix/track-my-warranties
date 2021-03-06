const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError");
const {
  isLoggedIn,
  isOwner,
  fileBelongsToEntry,
  isSpaceAvailable,
} = require("../middleware");
const files = require("../controllers/files");
const catchAsync = require("../utils/catchAsync");
const uuid = require("uuid");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../aws/s3");

const fileFilter = (req, file, cb) => {
  const isAllowableMimeType =
    file.mimetype.startsWith("image/") || file.mimetype === "application/pdf";
  if (isAllowableMimeType) {
    cb(null, true);
  } else {
    cb(
      new ExpressError("Invalid mime type, only images and PDFs.", 415),
      false
    );
  }
};

const size10mb = 10 * 1024 * 1024;

const uploadS3 = multer({
  limits: { fileSize: size10mb },
  fileFilter: fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET || "track-my-warranties-dev",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(
        null,
        uuid.v4() + "-" + file.originalname.replace(/[^\.a-zA-Z0-9_-]/g, "")
      );
    },
  }),
});

router.post(
  "/",
  isLoggedIn,
  catchAsync(isSpaceAvailable),
  catchAsync(isOwner),
  uploadS3.single("file"),
  catchAsync(files.uploadFile)
);

router.delete(
  "/:fileKey",
  isLoggedIn,
  catchAsync(isOwner),
  catchAsync(fileBelongsToEntry),
  catchAsync(files.deleteFile)
);

module.exports = router;
