const express = require('express');
const userRouter = express.Router();
const parser = require('body-parser').json();
// const { verify } = require('../lib/jwt');
const User = require('../models/user.model');
const { mustBeUser } = require('./mustBeUser');
userRouter.post('/signup',parser, (req,res) => {
    const { email, password, name, phone} = req.body;
    User.signUp(email, password, name, phone)
    .then(user => res.send({ success: true, user}) )
    .catch(res.onError);
});

userRouter.post('/signin',parser, (req,res) => {
    const { email, password} = req.body;
    User.signIn(email, password)
    .then(user => res.send({ success: true, user}) )
    .catch(res.onError);
});

userRouter.post('/check', mustBeUser, (req,res) => {
    User.check(req.idUser)
    .then(user => res.send({ success: true, user}) )
    .catch(res.onError);
});


module.exports = { userRouter };