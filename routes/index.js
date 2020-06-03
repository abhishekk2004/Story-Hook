const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { ensureAuthenticated, ensureGuest } = require("../auth/auth");

const User = require("../models/user");
const Story = require("../models/story");

const router = express.Router();

router.get("/", ensureGuest, (req, res) => {
  res.render("index/welcome");
});

router.get("/about", (req, res) => {
  res.render("index/about");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  Story.find({ user: req.user.id })
    .populate("User")
    .sort({ date: "desc" })
    .lean()
    .then((story) => {
      if (story) {
        res.render("index/dashboard", {
          story: story,
        });
      }
    });
});

router.get("/register", ensureGuest, (req, res) => {
  res.render("auth/register");
});

router.get("/login", ensureGuest, (req, res) => {
  res.render("auth/login");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.post("/register", (req, res) => {
  const errors = [];
  if (req.body.pass1 != req.body.pass2) {
    errors.push("incorrect Password");
  }
  if (errors.length > 0) {
    req.flash("error_msg", "Incorrect Password");
    res.redirect("/register");
  } else {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.pass1,
    };

    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        req.flash("error_msg", "Email Already Exist");
        res.redirect("/register");
      } else {
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err) {
              console.log(err);
            } else {
              newUser.password = hash;
              new User(newUser).save().then((user) => {
                req.flash("success_msg", "Sucessfully Registered!");
                res.redirect("/login");
              });
            }
          });
        });
      }
    });
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

module.exports = router;
