const ExpressError = require('./utils/ExpressError');
const Entry = require('./models/entry');
const { entryValidationSchema, userValidationSchema } = require('./models/validation');
const axios = require('axios');

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
    if (!entry) return next(); //commit: c7d7735
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

module.exports.isSpaceAvailable = async (req, res, next) => {
    const entries = await Entry.find({ user: req.user._id });
    const files = [];
    for (let entry of entries) files.push(...entry.files);
    let storage = files.reduce((a, b) => a + b.size, 0);
    const size500mb = 500 * 1024 * 1024;
    if (storage > size500mb) {
        return res.status(418).json({ 'result': 'You have exceeded storage capacity!' });
    }
    next();
}

module.exports.validateEntry = (req, res, next) => {
    const { error } = entryValidationSchema.validate(req.body);
    // console.log(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateUser = (req, res, next) => {
    const { error } = userValidationSchema.validate({ email: req.body.email });
    // console.log(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.emailToLowerCase = (req, res, next) => {
    req.body.email = req.body.email.toLowerCase();
    next();
}

module.exports.checkCaptcha = async (req, res, next) => {
    if ('RECAPTCHA_SITE_KEY' in process.env && 'RECAPTCHA_SECRET_KEY' in process.env) {
        axios.post('https://www.google.com/recaptcha/api/siteverify', undefined, {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: req.body['g-recaptcha-response']
            }
        })
            .then(function (response) {
                if (response.data.success) {
                    next();
                } else {
                    next(new ExpressError('Invalid reCAPTCHA response', 400));
                }
            })
            .catch(function (error) {
                next(new ExpressError('Invalid reCAPTCHA response', 400));
            });
    } else next();
}