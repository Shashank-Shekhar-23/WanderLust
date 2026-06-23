const express = require('express');
const router = express.Router();
const User = require("../Models/user");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');

const UserController = require('../controllers/users');

router.route("/signup")
    .get(UserController.renderSignupForm)
    .post(wrapAsync(UserController.signup));

router.route("/login")
    .get(UserController.renderloginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        UserController.login
    );

router.get("/logout", UserController.logout);

module.exports = router;