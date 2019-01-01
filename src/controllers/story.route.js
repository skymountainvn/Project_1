const express = require('express');
const storyRouter = express.Router();
const parser = require('body-parser').json();

const Story = require('../models/story.model');

const { mustBeUser } = require('./mustBeUser');

storyRouter.use(mustBeUser);
storyRouter.use(parser);

// storyRouter.get('/', (req, res) => {});

storyRouter.post('/', (req, res) => {
    Story.createStory(req.idUser, req.body.content)
    .then(story => res.send({ success: true, story }))
    .catch(res.onError);
});


storyRouter.delete('/:id', (req, res) => {
    Story.removeStory(req.idUser, req.params.id)
    .then(story => res.send({ success: true, story }))
    .catch(res.onError);
});


storyRouter.put('/:id', (req, res) => {
    Story.updateStory(req.idUser, req.params.id, req.body.content)
    .then(story => res.send({ success: true, story }))
    .catch(res.onError);
});


storyRouter.post('/like/:idStory', (req, res) => {
    Story.likeStory(req.idUser, req.params.idStory)
    .then(story => res.send({ success: true, story }))
    .catch(res.onError);
});


storyRouter.post('/dislike/:idStory', (req, res) => {
    Story.dislikeStory(req.idUser, req.params.idStory)
    .then(story => res.send({ success: true, story }))
    .catch(res.onError);
});

module.exports = { storyRouter };



