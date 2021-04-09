const Entry = require('../models/entry');

module.exports.uploadFile = async (req, res) => {
    const file = {
        originalFileName: req.file.originalname,
        storedFileName: req.file.key,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: req.file.location,
        bucket: req.file.bucket,
        dateCreated: new Date(Date.now())
    };
    const { id } = req.params;
    const entry = await Entry.findById(id);
    entry.files.push(file);
    await entry.save();
    console.log(file);
    res.json({ file });
}