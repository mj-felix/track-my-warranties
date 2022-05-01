const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const auth = require("../controllers/auth");
const {
  validateUser,
  emailToLowerCase,
  checkCaptcha,
} = require("../middleware");

router
  .route("/register")
  .get(auth.renderRegister)
  .post(
    catchAsync(checkCaptcha),
    validateUser,
    emailToLowerCase,
    catchAsync(auth.register)
  );

router
  .route("/login")
  .get(auth.renderLogin)
  .post(
    validateUser,
    emailToLowerCase,
    passport.authenticate("local", {
      failureFlash: "Invalid email or password.",
      failureRedirect: "/login",
    }),
    catchAsync(auth.login)
  );

router.get("/logout", auth.logout);

router
  .route("/forgotpassword")
  .get(auth.renderForgotPassword)
  .post(validateUser, emailToLowerCase, catchAsync(auth.forgotPassword));

router
  .route("/resetpassword")
  .get(auth.renderResetPassword)
  .post(validateUser, emailToLowerCase, catchAsync(auth.resetPassword));

router.get("/success", auth.success);

module.exports = router;
