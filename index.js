const express = require('express');
const reload = require('reload');
const upload = require('./uploadConfig');
const cookieParser = require('cookie-parser');

const { sign, verify } = require('./jwt');
const { hash, compare } = require('bcrypt');
const User = require('./models/user.model');

const parser = require('body-parser').urlencoded({ extended: false });

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cookieParser());

reload(app);

const redirectIfLoggedIn = (req, res, next) => {
    if (!req.cookies.token) return next();
    verify(req.cookies.token)
    .then(() => res.redirect('/'))
    .catch(() => {
        res.clearCookie('token');
        next();
    })
}

app.get('/', (req, res) => {
    if (!req.cookies.token) return res.redirect('/dangnhap');
    verify(req.cookies.token)
    .then(obj => User.findById(obj._id))
    .then(user => {
        if (!user) throw new Error('Cannot find user.');
        res.render('trangchu', { user });
    })
    .catch(err => res.clearCookie('token').redirect('/dangnhap'));
});

app.post('/dangnhap', parser, (req, res) => {
    const { email, password } = req.body;
    User.signIn(email, password)
    .then(user => sign({ _id: user._id }))
    .then(token => res.cookie('token', token).redirect('/'))
    .catch(err => res.send('Dang nhap that bai.'));
});

app.get('/dangky', redirectIfLoggedIn, (req, res) => {
    res.render('dangky');
});

app.get('/dangnhap', redirectIfLoggedIn, (req, res) => {
   res.render('dangnhap');
});

app.post('/dangky', (req, res) => {
    upload.single('avatar')(req, res, err => {
        const { name, email, password, phone } = req.body;
        const avatar = req.file ? req.file.filename : 'default.png';
        User.signUp(email, password, name, phone, avatar)
            .then(user => res.send('Dang ky thanh cong'))
            .catch(err => res.send('Dang ky that bai'));
    });
});

app.listen(3000, () => console.log('Server started!'));
