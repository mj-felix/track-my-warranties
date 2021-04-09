const Entry = require('../models/entry');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_ACCESS_SECRET
});

module.exports.index = async (req, res) => {
    const entries = await Entry.find({ user: req.user }).sort({ dateExpired: 1 });
    res.render("entries/index", { entries });
}

module.exports.renderNewForm = (req, res) => {
    res.render('entries/new', { isNewEntryForm: true });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const entry = await Entry.findById(id)
    if (!entry) {
        req.flash('error', 'Cannot find this warranty!');
        return res.redirect('/entries');
    }
    res.render('entries/edit', { entry });
}

module.exports.createEntry = async (req, res, next) => {
    const entry = new Entry(req.body.entry);
    const d = new Date(Date.now());
    entry.dateCreated = d;
    entry.dateModified = d;
    entry.user = req.user._id;
    await entry.save();
    req.flash('success', 'Successfully added a new warranty!');
    res.redirect(`/entries/${entry._id}`)
}

module.exports.showEntry = async (req, res) => {
    const entry = await Entry.findById(req.params.id)
    if (!entry) {
        req.flash('error', 'Cannot find this warranty!');
        return res.redirect('/entries');
    }
    res.render('entries/show', { entry });
}

module.exports.deleteEntry = async (req, res) => {
    const { id } = req.params;
    const entry = await Entry.findById(id);
    if (entry.files.length) {
        const deleteParam = {
            Bucket: process.env.S3_BUCKET,
            Delete: {
                Objects: []
            }
        };
        for (let file of entry.files) {
            deleteParam.Delete.Objects.push({ Key: file.storedFileName })
        }
        await s3.deleteObjects(deleteParam).promise();
    }
    await Entry.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted warranty!')
    res.redirect('/entries');
}

module.exports.updateEntry = async (req, res) => {
    const { id } = req.params;
    const entry = await Entry.findByIdAndUpdate(id, { ...req.body.entry, dateModified: new Date(Date.now()) });

    req.flash('success', 'Successfully updated warranty!');
    res.redirect(`/entries/${entry._id}`)
}
