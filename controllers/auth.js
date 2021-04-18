const User = require('../models/user');
const sgMail = require('@sendgrid/mail');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.renderRegister = (req, res) => {
    if (req.isAuthenticated()) {
        req.logout();
        return res.redirect('/');
    }
    res.render('auth/register', { isRegisterForm: true });
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const currDate = new Date();
        const accessLevel = email === process.env.ADMIN_EMAIL ? 'Admin' : 'User';
        const user = new User({ username: email, dateCreated: currDate, dateModified: currDate, currentLoginDate: currDate, accessLevel });
        const registeredUser = await User.register(user, password);

        if ('SENDGRID_API_KEY' in process.env) {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            const msg = {
                to: process.env.ADMIN_EMAIL,
                from: process.env.NO_RESPONSE_EMAIL,
                subject: '[Track My Warranties] New user',
                text: `Email: ${email}\nCreated: ${currDate.toUTCString()}`,
            }
            sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent')
                })
                .catch((error) => {
                    console.error(error)
                })
        }

        req.login(registeredUser, err => {
            if (err) return next(err);
            // req.flash('success', 'Welcome to Track My Warranties!');
            res.redirect(`/entries/new`);
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res) => {
    if (req.isAuthenticated()) {
        req.logout();
        return res.redirect('/');
    }
    res.render('auth/login', { isLoginForm: true });
}

module.exports.login = async (req, res) => {
    // req.flash('success', 'Welcome back!');
    const user = await User.find({ _id: req.user._id });
    const lastLoginDate = user[0].currentLoginDate;
    const updatedUser = await User.findByIdAndUpdate(req.user._id, { lastLoginDate, currentLoginDate: new Date() });
    const redirectUrl = req.session.returnTo || `/entries`;
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    // req.session.destroy();
    req.flash('success', "Goodbye! Hope to see you soon.");
    res.redirect('/login');
}

module.exports.renderForgotPassword = (req, res) => {
    if (req.isAuthenticated()) {
        req.logout();
        return res.redirect('/');
    }
    res.render('auth/forgotPassword', { isForgotPasswordForm: true });
}

module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    req.flash('success', `Please follow the instructions sent to ${email} from ${process.env.NO_RESPONSE_EMAIL}`);
    const existingUser = await User.find({ username: email });
    if (!existingUser.length) return res.redirect('/success');
    const token = uuid.v4();
    bcrypt.hash(token, saltRounds, async function (err, hash) {
        const period1dayInMilliseconds = 1000 * 60 * 60 * 24;
        const tokenExpiryDate = new Date(Date.now() + period1dayInMilliseconds);
        await User.updateOne({ username: email }, { $set: { token: hash, tokenExpiryDate } });

        if ('SENDGRID_API_KEY' in process.env) {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            const resetUrl = process.env.PROD_URL || 'http://localhost:3000';
            const msg = {
                to: existingUser[0].username,
                from: process.env.NO_RESPONSE_EMAIL,
                subject: '[Track My Warranties] Reset Password',
                text: `Password reset requested. If it wasn't you, please ignore this email. Otherwise, please click:\n\n${resetUrl}/resetpassword?email=${existingUser[0].username}&token=${token}\n\nLink is valid for 24h.`,
            }
            sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent')
                })
                .catch((error) => {
                    console.error(error)
                })
        }

        res.redirect('/success');
    });

}

module.exports.success = (req, res) => {
    res.render('success');
}

module.exports.renderResetPassword = (req, res) => {
    if (req.isAuthenticated()) {
        req.logout();
        return res.redirect('/');
    }
    res.render('auth/resetPassword', { isResetPasswordForm: true });
}

module.exports.resetPassword = async (req, res) => {

    const { email, token, password } = req.body;
    const existingUsers = await User.find({ username: email });
    const existingUser = existingUsers[0];

    if (!existingUser || Date.now() > existingUser.tokenExpiryDate) {
        req.flash('error', 'Link invalid or expired. Please request new link.');
        return res.redirect('/forgotpassword');
    }
    bcrypt.compare(token, existingUser.token, async function (err, result) {
        if (result) {
            await existingUser.setPassword(password);
            await existingUser.save();
            req.flash('success', 'Password successfully reset. Please login.');
            res.redirect('/login');
        } else {
            req.flash('error', 'Link invalid or expired. Please request new link.');
            res.redirect('/forgotpassword');
        }
    });

}