const express = require("express");
const { ensureAuthenticated } = require("../auth/auth");

const Story = require("../models/story");

const router = express.Router();

router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("story/add");
});

router.get("/show/:id", ensureAuthenticated, (req, res) => {
  Story.findOne({ _id: req.params.id })
    .lean()
    .then((story) => {
      res.render("story/show", {
        story: story,
      });
    });
});

router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Story.findOne({ _id: req.params.id })
    .lean()
    .then((story) => {
      res.render("story/edit", {
        story: story,
      });
    });
});

router.post("/add", (req, res) => {
  const title = req.body.title;
  const content = req.body.content;

  const newStory = {
    title: title,
    content: content,
    user: req.user.id,
  };

  new Story(newStory).save().then((story) => {
    if (!story) {
      console.log("Story Is Not Created");
    } else {
      req.flash("success_msg", "Post/Story is Added");
      res.redirect("/dashboard");
    }
  });
});

router.put("/edit/:id", (req, res) => {
  Story.findOne({ _id: req.params.id }).then((story) => {
    story.title = req.body.title;
    story.content = req.body.content;
    story.save().then(() => {
      req.flash("success_msg", "Post/Story is Edited");
      res.redirect("/dashboard");
    });
  });
});

router.get("/delete/:id", (req, res) => {
  Story.deleteOne({ _id: req.params.id }).then((story) => {
    req.flash("error_msg", "Post/Story is Deleted");
    res.redirect("/dashboard");
  });
});

module.exports = router;
