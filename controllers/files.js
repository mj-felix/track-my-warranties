const Entry = require("../models/entry");
const s3 = require("../aws/s3");

module.exports.uploadFile = async (req, res) => {
  const file = {
    originalFileName: req.file.originalname,
    storedFileName: req.file.key,
    mimeType: req.file.mimetype,
    size: req.file.size,
    url: req.file.location,
    bucket: req.file.bucket,
    dateCreated: new Date(),
  };
  const { id } = req.params;
  const entry = await Entry.findById(id);
  entry.files.push(file);
  await entry.save();
  const entryId = entry._id;
  delete file.url;
  res.json({ file, entryId });
};

module.exports.deleteFile = async (req, res) => {
  const { id, fileKey } = req.params;
  await s3
    .deleteObject({
      Bucket: process.env.S3_BUCKET,
      Key: fileKey,
    })
    .promise();
  const entry = await Entry.findById(id);
  await entry.updateOne({ $pull: { files: { storedFileName: fileKey } } });
  res.json({ result: "file deleted" });
};
