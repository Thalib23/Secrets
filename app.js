
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/userDB', { useNewUrlParser: true });

    const userSchema = new mongoose.Schema({
        email: String,
        password: String
    });

    const User = new mongoose.model("User", userSchema);


    app.get("/", (req, res) => {
        res.render("home");
    });

    app.get("/login", (req, res) => {
        res.render("login");
    });

    app.get("/register", (req, res) => {
        res.render("register");
    });

    app.post("/register", (req, res) => {

        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            const newUser = new User({
                email: req.body.username,
                password: hash
            });
            newUser.save()
                .then(result => {
                    res.render("secrets");
                })
                .catch(err => {
                    console.log(err);
                });
        });

    });

    app.post("/login", (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        //

        User.findOne({ email: username })
            .then(foundUser => {
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(result === true){
                        res.render("secrets");
                    }
                });
            })
            .catch(err => {
                console.log(err);
            })
    });

    app.listen(port, () => {
        console.log("Server started on port " + port);
    });

}