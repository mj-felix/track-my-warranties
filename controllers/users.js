const User = require('../models/user');
const Entry = require('../models/entry');

module.exports.showUser = async (req, res) => {
    const users = await User.find({});
    const entries = await Entry.find({});
    let numOfEntries = 0;
    // const entries = await Entry.find({ user: req.user._id });
    const files = [];
    const allFiles = [];
    for (let entry of entries) {
        allFiles.push(...entry.files);
        if (entry.user.equals(req.user._id)) {
            files.push(...entry.files);
            numOfEntries++;
        }
    }
    let storage = files.reduce((a, b) => a + b.size, 0);
    storage = (storage / 1024 / 1024).toFixed(2);
    let allStorage = allFiles.reduce((a, b) => a + b.size, 0);
    allStorage = (allStorage / 1024 / 1024).toFixed(2);
    res.render('users/show', { isProfile: true, numOfEntries, numOfFiles: files.length, storage, numOfUsers: users.length, numOfAllEntries: entries.length, numOfAllFiles: allFiles.length, allStorage });
}

module.exports.renderEditForm = (req, res) => {
    res.render('users/edit');
}

module.exports.updateUser = async (req, res) => {
    const { email } = req.body;
    const existingUser = await User.find({ username: email });

    // console.log(existingUser)
    if (existingUser.length) {
        if (existingUser[0].username === req.user.username) {
            req.flash('error', 'It is the same email!');
            return res.redirect('/user/edit');
        }
        req.flash('error', 'You cannot use this email!');
        return res.redirect('/user/edit');
    }
    const user = await User.findByIdAndUpdate(req.user._id, { username: email, dateModified: new Date(Date.now()) });
    req.logout();
    req.flash('success', 'Successfully updated user. Please login again using your new email.');
    res.redirect('/login');

}