const express = require("express");
const bodyParser = require("body-parser");
const reload = require("reload");
const upload = require("./uploadConfig");
const user  = require("./models/user.model");
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views","./views");
reload(app);
app.use(cookieParser());

app.get("/", function( req,res )  {
    res.render("trangchu");
});

app.get("/dangky", function( req,res )  {
    res.render("dangky");
});

app.get("/dangnhap", function( req,res )  {
    res.render("dangky");
});

