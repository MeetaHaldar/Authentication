require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const encrypt = require("mongoose-encryption");
const app = express();
const md5 = require("md5");
mongoose.set("strictQuery", false);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userdb", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({ email: String, password: String });
const secret = process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });

  newUser.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", (req, res) => {
  const userName = req.body.username;
  const password = req.body.password;
  User.findOne({ email: userName }, function (err, findUser) {
    if (err) {
      console.log(err);
    } else {
      if (findUser) {
        if (findUser.password == md5(password)) {
          res.render("secrets");
        }
      }
    }
  });
});

app.listen(3000, (req, res) => console.log("it is running on port 3000"));
