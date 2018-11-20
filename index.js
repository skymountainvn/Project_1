const express = require("express");
const bodyParser = require("body-parser");
const reload = require("reload");
const upload = require("./uploadConfig");
const user  = require("./models/user.model");
const cookieParser = require('cookie-parser');
const { hash } = require('bcrypt');


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

app.post("/dangky", function( req,res )  {
    upload.single('avatar')(req, res, err => {
        const { name, email, password, phone } = req.body;
        const avatar = req.file ? req.file.filename : 'default.png';
        hash(password, 8)
        .then(encryted => {
            const user = new User({
                name,
                email,
                password: encryted,
                phone,
                avatar
            });
            return user.save();
        })
        .then(() => res.send('Dang ky thanh cong'))
        .catch(() => res.send('Dang ky that bai'));
    });
});

app.post("/dangnhap", function( req,res )  {
    
});

app.listen(3000, () => console.log("Server Started"));