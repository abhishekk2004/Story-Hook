const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require("../models/user");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      function (email, password, done) {
        User.findOne({ email: email }, function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, { message: "User Not Found!" });
          }

          bcrypt.compare(password, user.password).then((res) => {
            if (!res) {
              return done(null, false, { message: "Incorrect Password!" });
            } else {
              return done(null, user);
            }
          });
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
