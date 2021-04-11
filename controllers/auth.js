const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('auth/register', { isRegisterForm: true });
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const d = new Date(Date.now())
        const accessLevel = email === 'mjfelixdev@gmail.com' ? 'Admin' : 'User';
        const user = new User({ username: email, dateCreated: d, dateModified: d, currentLoginDate: d, accessLevel });
        const registeredUser = await User.register(user, password);
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
    res.render('auth/login', { isLoginForm: true });
}

module.exports.login = async (req, res) => {
    // req.flash('success', 'Welcome back!');
    const user = await User.find({ _id: req.user._id });
    const lastLoginDate = user[0].currentLoginDate;
    const updatedUser = await User.findByIdAndUpdate(req.user._id, { lastLoginDate, currentLoginDate: new Date(Date.now()) });
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