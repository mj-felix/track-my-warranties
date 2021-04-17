if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require("connect-mongo");
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const authRoutes = require('./routes/auth');
const entryRoutes = require('./routes/entries');
const userRoutes = require('./routes/users');
const fileRoutes = require('./routes/files');
const dateFormat = require("dateformat");


// MongoDB connection
const dbName = 'track-my-warranties';
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/track-my-warranties';
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log(`${new Date(Date.now()).toString()}: database connected`);
});

const app = express();

// Views setup
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session setup
const secret = process.env.SECRET || 'thisIsNotAGoodSecret!';
const store = MongoStore.create({
    mongoUrl,
    dbName,
    secret,
    touchAfter: 24 * 60 * 60
});
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    proxy: true,
    cookie: {
        httpOnly: true,
        secure: (process.env.NODE_ENV !== "production") ? false : true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

// Misc setup
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/",
];
const connectSrcUrls = [];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://track-my-warranties.s3.ap-southeast-2.amazonaws.com",
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// Mongo injection prevention
app.use(mongoSanitize({
    replaceWith: '_'
}))


// Auth setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
    },
    User.authenticate()
));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// locals mw setup
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.dateFormat = dateFormat;
    next();
})

// herokuapp.com subdomain permanent redirection
if (process.env.PROVIDER === 'heroku' && process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.hostname.includes('track-my-warranties')) {
            res.redirect(301, 'https://trackmywarranties.mjfelix.dev')
        }
        else
            next()
    })
}

// ROUTING:
app.use('/', authRoutes);
app.use('/user', userRoutes);
app.use('/entries', entryRoutes);
app.use('/entries', fileRoutes);

// main page
app.get('/', (req, res) => {
    res.render('home');
});

// everything else => 404
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`${new Date(Date.now()).toString()}: serving on port ${port}`);
})