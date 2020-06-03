const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");

// require pages
const story = require("./routes/story");
const index = require("./routes/index");

// require moment element
const { truncate, formateDate } = require("./auth/auth");

const app = express();

mongoose.connect(
  "mongodb+srv://admin-abhishek:abhishek@cluster0-voopf.mongodb.net/storyDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Load Passport

require("./auth/passport")(passport);

// Moment Formater

app.use(
  session({
    secret: "Saru Singh",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine(
  "handlebars",
  exphbs({
    helpers: {
      formateDate: formateDate,
      truncate: truncate,
    },
  })
);
app.set("view engine", "handlebars");
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", story);
app.use("/", index);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("The server is running on the PORT: " + PORT);
});
