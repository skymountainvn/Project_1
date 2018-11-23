const express = require("express");
const parser = require("body-parser").urlencoded({ extended: false });
const reload = require("reload")
const upload = require("./uploadConfig");
const User  = require("./models/user.model");

// const cookieParser = require('cookie-parser');

const { hash, compare } = require('bcrypt');

const app = express();
app.set("view engine", "ejs");
app.set("views","./views");  //duong dẫn đến views
app.use(express.static("./public"));  // duong dẫn đến public
reload(app);
// app.use(cookieParser());

app.get("/", ( req,res ) => {
    res.render("trangchu");
});

app.get("/dangky", ( req,res ) => {
    res.render("dangky");
});

app.get("/dangnhap", ( req,res )  => {
    res.render("dangnhap");
});

app.post("/dangky", (req,res) =>  {
    upload.single('avatar')(req, res, err => {  //single là up 1 file
        const { name, email, password, phone } = req.body;
        const avatar = req.file ? req.file.filename : 'default.png'; // lấy tên đặt hoặc tên mặc định
        User.signUp(() => res.send('Dang ky thanh cong'))
            .catch(err => res.send('Dang ky that bai'));
    });
});

    




app.post('/dangnhap', parser, (req, res) => {
    const { email, password } = req.body;
    User.signIn(email, password)
        .then(() => res.send('Dang nhap thanh cong.'))
        .catch(err => res.send('Dang nhap that bai.'));
});

    

app.listen(3000, () => console.log("Server Started"));