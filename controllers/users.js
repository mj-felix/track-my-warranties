const User = require('../models/user');
const Entry = require('../models/entry');

module.exports.showUser = async (req, res) => {
    const entries = await Entry.find({ user: req.user._id });
    const files = []
    for (let entry of entries) files.push(...entry.files);
    let storage = files.reduce((a, b) => a + b.size, 0);
    storage = (storage / 1024 / 1024).toFixed(2);
    res.render('users/show', { isProfile: true, numOfEntries: entries.length, numOfFiles: files.length, storage });
}

module.exports.renderEditForm = (req, res) => {
    res.render('users/edit');
}

module.exports.updateUser = async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id, { username: req.body.email, dateModified: new Date(Date.now()) });
    req.logout();
    req.flash('success', 'Successfully updated user. Please login again using your new email.');
    res.redirect('/login');
}