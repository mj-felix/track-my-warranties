const ExpressError = require('./utils/ExpressError');
const Entry = require('./models/entry');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const entry = await Entry.findById(id);
    if (!entry.user.equals(req.user._id)) {
        if (req.headers.accept.indexOf('json') > -1) {
            return res.status(403).json({ 'result': 'You do not have permission to do that!' });
        } else {
            req.flash('error', 'You do not have permission to do that!');
            return res.redirect('/entries');
        }

    }
    next();
}

module.exports.fileBelongsToEntry = async (req, res, next) => {
    const { id, fileKey } = req.params;
    const entry = await Entry.findById(id);
    if (!entry.files.find(file => file.storedFileName === fileKey)) {
        return res.status(403).json({ 'result': 'You do not have permission to do that!' });
    }
    next();
}