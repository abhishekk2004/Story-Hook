const moment = require("moment");

module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("error_msg", "Please Login first");
      res.redirect("/login");
    }
  },

  ensureGuest: (req, res, next) => {
    if (req.isAuthenticated()) {
      res.redirect("/dashboard");
    } else {
      return next();
    }
  },

  formateDate: function (date, format) {
    return moment(date).format(format);
  },

  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      var new_str = str + " ";
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(" "));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + "...";
    }
    return str;
  },
};
