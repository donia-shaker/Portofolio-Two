const exp = require("constants");
const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("views/css"));
app.use(express.static("views"));
app.use(express.static("views/images"));
app.get("/", function (req, res) {
  res.render("index");
});

app.listen("3000");
