const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const authRoutes = require("./routes/auth");
const entryRoutes = require("./routes/entries");
const userRoutes = require("./routes/users");
const fileRoutes = require("./routes/files");
const attachmentRoutes = require("./routes/attachments");
const replaceLinks = require("./utils/replaceLinks.js");
const dateFormat = require("dateformat");
const csrf = require("csurf");
const nocache = require("nocache");

// MongoDB connection
const dbName = "track-my-warranties";
const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost:27017/track-my-warranties";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log(`${new Date(Date.now()).toString()}: database connected`);
});

const app = express();

// Views setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session setup
const secret = process.env.SECRET;
const period1dayInSeconds = 24 * 60 * 60;
const store = MongoStore.create({
  mongoUrl,
  dbName,
  secret,
  touchAfter: period1dayInSeconds,
});
store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});
const period1dayInMilliseconds = 1000 * 60 * 60 * 24 * 1;
const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  proxy: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "production" ? false : true,
    expires: Date.now() + period1dayInMilliseconds,
    maxAge: period1dayInMilliseconds,
  },
};
app.use(session(sessionConfig));

// Misc setup
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
  "https://cdn.jsdelivr.net",
  "https://www.google.com",
  "https://www.gstatic.com",
  "'unsafe-inline'",
];
const styleSrcUrls = ["https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/"];
const frameSrcUrls = ["https://www.google.com"];
const connectSrcUrls = [];
const fontSrcUrls = [];
const imgSrcUrls = ["https://images.unsplash.com"];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["blob:"],
      frameSrc: [...frameSrcUrls],
      objectSrc: [],
      imgSrc: ["'self'", "blob:", "data:", ...imgSrcUrls],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// Mongo injection prevention
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

// Auth setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    User.authenticate()
  )
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// locals mw setup
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.dateFormat = dateFormat;
  res.locals.replaceLinks = replaceLinks;
  next();
});

// CSRF protection
app.use(csrf());
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// herokuapp.com subdomain permanent redirection
if (
  process.env.PROVIDER === "heroku" &&
  process.env.NODE_ENV === "production"
) {
  app.use((req, res, next) => {
    if (req.hostname.includes("track-my-warranties")) {
      res.redirect(301, "https://trackmywarranties.mjfelix.dev");
    } else next();
  });
}

// redirection to https - heroku way
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https")
      res.redirect(301, `https://${req.header("host")}${req.url}`);
    else next();
  });
}

// remove caching
app.use(nocache());
app.set("etag", false);

// Use Morgan logging in dev
if (process.env.NODE_ENV !== "production") {
  const morgan = require("morgan");
  app.use(
    morgan(
      ":user-agent :date[iso] :method :url :status :response-time ms - :res[content-length]"
    )
  );
}

// ROUTING:
app.use("/", authRoutes);
app.use("/user", userRoutes);
app.use("/entries", entryRoutes);
app.use("/entries/:id/files", fileRoutes);
app.use("/attachments", attachmentRoutes);

// main page
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/entries");
  }
  res.render("home");
});

// everything else => 404
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  // Set CSRF error message
  if (err.code === "EBADCSRFTOKEN") {
    err.message = "CSRF attack?! Not cool to tamper with the form!";
  }

  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`${new Date().toString()}: serving on port ${port}`);
});
