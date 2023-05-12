const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const { loweCase } = require("lodash");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
res = app.get;

const uri = "mongodb://localhost:27017/wiki";
mongoose.connect(uri);

const articleSchema = {
  title: String,
  text: String,
};

const Articles = mongoose.model("wiki", articleSchema);

app
  .route("/article")
  .get(function (req, res) {
    Articles.findOne({})
      .then(function (found) {
        console.log(found);
        res.send(found);
      })
      .catch(function (err) {
        console.log(err);
      });
  })
  .post(function (req, res) {
    const post = {
      title: req.body.title,
      text: req.body.text,
    };
    const newPost = new Articles(post);
    newPost
      .save()
      .then(function (result) {
        console.log("Added" + result);
        res.send("Success");
      })
      .catch(function (err) {
        console.log(err);
        res.send(err.message);
      });
  })
  .delete(function (req, res) {
    Articles.deleteMany()
      .then(function (item) {
        res.send("Delete article");
      })
      .catch(function (err) {
        res.send(err.message);
      });
  });

app
  .route("/article/:articleId")
  .get(function (req, res) {
    const articleId = req.params.articleId;
    Articles.findById(articleId)
      .then(function (item) {
        console.log(item);
        res.send(item);
      })
      .catch(function (err) {
        console.log(err.message);
        res.send("Article not found");
      });
  })
  .put(function (req, res) {
    const articleId = req.params.articleId;
    const updated = {
      title: req.body.title,
      text: req.body.text,
    };
    Articles.findByIdAndUpdate(articleId, updated, {overwrite: true})
      .then(function (article) {
        console.log(article);
        res.send("Success");
      })
      .catch(function (err) {
        console.log(err);
        res.send("Error, " + err);
      });
  })
  .patch(function (req, res) {
    const articleId = req.params.articleId;
    const updated = {
      title: req.body.title,
      text: req.body.text,
    };
    Articles.findByIdAndUpdate(articleId, updated)
      .then(function (article) {
        console.log(article);
        res.send("Success");
      })
      .catch(function (err) {
        console.log(err);
        res.send("Error, " + err);
      });
  })
  .delete(function (req, res) {
    const articleId = req.params.articleId;
    Articles.findByIdAndDelete(articleId)
      .then(function (article) {
        console.log("Success");
        res.send("Success");
      })
      .catch(function (err) {
        console.log(err);
        res.send("Error, " + err);
      });
  });

app.delete("/article");
app.listen(3000, function () {
  console.log("Service listening");
});
