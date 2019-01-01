const express = require('express');
const User = require('./models/user.model');
const cors = require('cors');
// const parser = require('body-parser').urlencoded({extended: false});
const parser = require('body-parser').json();
const { sign, verify} = require('./lib/jwt.js');
const { storyRouter } = require('./controllers/story.route');
const { userRouter } = require('./controllers/user.route');
const { friendRouter } = require('./controllers/friend.route');
const { commentRouter } = require('./controllers/comment.route');
const app = express();
app.use(cors());
app.use((req, res, next) => {
    res.onError = (error) => {
        const statusCode = error.statusCode || 500;
        const { message, code } = error;
        if (statusCode === 500) console.log(error);
        res.status(statusCode)
        .send({ success: false, message, code });
    }
    next();
});

app.use('/user', userRouter);
app.use('/story',storyRouter);
app.use('/friend',friendRouter);
app.use('/comment', commentRouter);

module.exports = app;