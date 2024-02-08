const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/blogWebsite", {
  connectTimeoutMS: 30000,
});

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Blog = mongoose.model("Blog", blogSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  Blog.find()
    .then(function (blogPosts) {
      res.render("index", { blogPosts });
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    });
});

app.post("/add-post", function (req, res) {
  const { title, content } = req.body;
  const newPost = new Blog({
    title,
    content,
  });
  newPost
    .save()
    .then(function () {
      res.redirect("/");
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/blog-list", function (req, res) {
  Blog.find()
    .then(function (blogPosts) {
      res.render("blog-list", { blogPosts });
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).send("some Error is occured");
    });
});

app.listen(port, function () {
  console.log("Server is running on port 3000");
});
