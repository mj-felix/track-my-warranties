const User = require('../models/user');

module.exports.showUser = (req, res) => {
    res.render('users/show', { isProfile: true });
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