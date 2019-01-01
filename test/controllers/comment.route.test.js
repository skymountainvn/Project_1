const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../../src/app');
const User = require('../../src/models/user.model');
const Story = require('../../src/models/story.model');
const Comment = require('../../src/models/comment.model');

describe('Test POST /comment', () => {
    let idUser1, idUser2, idStory1, idStory2, token1, token2;
    beforeEach('Create story for test', async () => {
        await User.signUp('a@gmail.com', '123', 'teo', '321');
        await User.signUp('b@gmail.com', '123', 'ty', '123');
        const user1 = await User.signIn('a@gmail.com', '123');
        const user2 = await User.signIn('b@gmail.com', '123');
        token1 = user1.token;
        token2 = user2.token;
        idUser1 = user1._id; 
        idUser2 = user2._id;
        const story1 = await Story.createStory(idUser1, 'abcd');
        const story2 = await Story.createStory(idUser2, 'dcab');
        idStory1 = story1._id;
        idStory2 = story2._id;
    });

    it('Can create comment by POST', async () => {
        const response = await request(app)
        .post('/comment')
        .set({ token: token2 })
        .send({ idStory: idStory1, content: 'Hello Ti.' });
        // console.log(response.body)

        const { success, comment } = response.body;
        const { author, content, story, _id } = comment;
        assert.equal(success, true);
        assert.equal(author, idUser2);
        assert.equal(story, idStory1);
        const storyDb = await Story.findById(idStory1);
        assert.equal(storyDb.comments[0], _id);
    });

    it('Can create comment without token', async () => {
        const response = await request(app)
        .post('/comment')
        .send({ idStory: idStory1, content: 'Hello Ti.' });
        const { success, message } = response.body;
        assert.equal(success, false);
        assert.equal(message, 'Invalid token');
    });

    it('Cannot create comment for invalid story', async () => {
        const response = await request(app)
        .post('/comment')
        .set({ token: token2 })
        .send({ idStory: idStory1 +'x' , content: 'Hello Ti.' });
        const { success, code } = response.body;
        assert.equal(success, false);
        console.log(idStory1)
        assert.equal(code, 'INVALID_ID');
    });

    it('Cannot create comment for removed story', async () => {
        await Story.findByIdAndRemove(idStory2);
        const response = await request(app)
        .post('/comment')
        .set({ token: token2 })
        .send({ idStory: idStory2, content: 'Hello Ti.' });
        const { success, code } = response.body;
        // console.log(response.body)
        assert.equal(success, false);
        assert.equal(code, 'CANNOT_FIND_STORY');
        const commentCount = await Comment.count({});
        assert.equal(commentCount, 0);
    });
});


describe('Test POST /comment', () => {
    let idUser1, idUser2, idStory1, idStory2, token1, token2, idComment;

    beforeEach('Create story for test', async () => {
        await User.signUp('a@gmail.com', '123', 'teo', '321');
        await User.signUp('b@gmail.com', '123', 'ty', '123');
        const user1 = await User.signIn('a@gmail.com', '123');
        const user2 = await User.signIn('b@gmail.com', '123');
        token1 = user1.token;
        token2 = user2.token;
        idUser1 = user1._id; 
        idUser2 = user2._id;
        const story1 = await Story.createStory(idUser1, 'abcd');
        const story2 = await Story.createStory(idUser2, 'dcab');
        idStory1 = story1._id;
        idStory2 = story2._id;
        const comment = await Comment.createComment(idUser1, idStory1, 'xyz');
        idComment = comment.id;
    });
    
    it('Can delete comment by DELETE /:id', async () => {
        const response = await request(app)
        .delete(`/comment/${idComment}`)
        .set({ token: token1 });
        // console.log(response.body);
        assert.equal(response.body.comment.content,'xyz');
        const commentCount = await Comment.count({ });
        assert.equal(commentCount, 0);
        const story = await Story.findById(idStory1);
        // console.log(story)
        assert.equal(story.comments.length, 0)
    });

    it('Cannot delete comment with invalid ID', async () => {
        const response = await request(app)
        .delete(`/comment/${idComment}x`)
        .set({ token: token1 });
        // console.log(response.body)
        assert.equal(response.body.success, false);
        assert.equal(response.body.code, 'INVALID_ID');
    });

    it('Cannot remove comment without token', async () => {
        const response = await request(app)
        .delete(`/comment/${idComment}`)
        // console.log(response.body)
        assert.equal(response.body.success, false);
        assert.equal(response.body.message, 'Invalid token');
    });
});


describe('Test PUT /comment', () => {
    let idUser1, idUser2, idStory1, idStory2, token1, token2, idComment;

    beforeEach('Create story for test', async () => {
        await User.signUp('a@gmail.com', '123', 'teo', '321');
        await User.signUp('b@gmail.com', '123', 'ty', '123');
        const user1 = await User.signIn('a@gmail.com', '123');
        const user2 = await User.signIn('b@gmail.com', '123');
        token1 = user1.token;
        token2 = user2.token;
        idUser1 = user1._id; 
        idUser2 = user2._id;
        const story1 = await Story.createStory(idUser1, 'abcd');
        const story2 = await Story.createStory(idUser2, 'dcab');
        idStory1 = story1._id;
        idStory2 = story2._id;
        const comment = await Comment.createComment(idUser1, idStory1, 'xyz');
        idComment = comment.id;
    });
    
    it('Can update comment by PUT /:id', async () => {
        const response = await request(app)
        .put(`/comment/${idComment}`)
        .send({content: '123asd'})
        .set({ token: token1 })  

        // console.log(response.body)
        console.log(response.body.comment)
        // console.log(response.body.comment.content.token1)
        assert.equal(response.body.comment.content, '123asd');
        const commnet = await Comment.findOne({});
        // assert.equal(commnet.content,'123asd');
    });

    it('Cannot update comment without token', async () => {
        const response = await request(app)
        .put(`/comment/${idComment}`)
        .send({content: '123asd'})
        assert.equal(response.body.success,false);
        assert.equal(response.body.message,'Invalid token');
    });

    // it('Cannot update others comment token', async () => {
    //     const response = await request(app)
    //     .put(`/comment/${idComment}`)
    //     .set({ token: token2})
    //     .send({content: '123asd'})
    //     assert.equal(response.body.success,false);
    //     assert.equal(response.body.message,'Cannot find comment');
    // });

    it('Cannot create comment for invalid story', async () => {
        const response = await request(app)
        .post('/comment')
        .set({ token: token2 })
        .send({ idStory: idStory1 + 'x', content: 'Hello Ti.' });
        const { success, code } = response.body;
        assert.equal(success, false);
        assert.equal(code, 'INVALID_ID');
    });
    it('Cannot update comment with wrong ID', async () => {
        const response = await request(app)
        .put(`/comment/${idComment}x`)
        .set({ token: token2})
        .send({content: '123asd'})
        assert.equal(response.body.success,false);
        assert.equal(response.body.code,'INVALID_ID');
    });
});

describe('Test POST /comment/like/:id', () => {
    let idUser1, idUser2, idStory1, idStory2, token1, token2, idComment;

    beforeEach('Create story for test', async () => {
        await User.signUp('a@gmail.com', '123', 'teo', '321');
        await User.signUp('b@gmail.com', '123', 'ty', '123');
        const user1 = await User.signIn('a@gmail.com', '123');
        const user2 = await User.signIn('b@gmail.com', '123');
        token1 = user1.token;
        token2 = user2.token;
        idUser1 = user1._id; 
        idUser2 = user2._id;
        const story1 = await Story.createStory(idUser1, 'abcd');
        const story2 = await Story.createStory(idUser2, 'dcab');
        idStory1 = story1._id;
        idStory2 = story2._id;
        const comment = await Comment.createComment(idUser1, idStory1, 'xyz');
        idComment = comment.id;
    });
    
    it('Can like comment by POST ', async () => {
        const response = await request(app)
        .post(`/comment/like/${idComment}`)
        .set({ token: token2 })
        assert.equal(response.body.comment.fans[0], idUser2);
        const comment = await Comment.findById(idComment);
        assert.equal(comment.fans[0], idUser2.toString());
       
    });

    it('Cannot like comment with wrong ID', async () => {
        const response = await request(app)
        .post(`/comment/like/${idComment}x`)
        .set({ token: token2 })
        assert.equal(response.body.code, 'INVALID_ID');
    });

    it('Cannot like comment without token', async () => {
        const response = await request(app)
        .post(`/comment/like/${idComment}`)
        assert.equal(response.body.message, 'Invalid token');
       
    });
});

describe('Test POST /comment/dislike/:id', () => {
    let idUser1, idUser2, idStory1, idStory2, token1, token2, idComment;

    beforeEach('Create story for test', async () => {
        await User.signUp('a@gmail.com', '123', 'teo', '321');
        await User.signUp('b@gmail.com', '123', 'ty', '123');
        const user1 = await User.signIn('a@gmail.com', '123');
        const user2 = await User.signIn('b@gmail.com', '123');
        token1 = user1.token;
        token2 = user2.token;
        idUser1 = user1._id; 
        idUser2 = user2._id;
        const story1 = await Story.createStory(idUser1, 'abcd');
        const story2 = await Story.createStory(idUser2, 'dcab');
        idStory1 = story1._id;
        idStory2 = story2._id;
        const comment = await Comment.createComment(idUser1, idStory1, 'xyz');
        await Comment.likeComment(idUser2,comment._id);
        idComment = comment.id;

    });
    
    it('Can dislike comment by POST ', async () => {
        const response = await request(app)
        .post(`/comment/dislike/${idComment}`)
        .set({ token: token2 })
        assert.equal(response.body.comment.fans.length, 0)
        const comment = await Comment.findById(idComment);
        assert.equal(comment.fans.length, 0);
       
    });

    it('Cannot dislike comment with wrong ID', async () => {
        const response = await request(app)
        .post(`/comment/like/${idComment}x`)
        .set({ token: token2 })
        assert.equal(response.body.code, 'INVALID_ID');
    });

    it('Cannot dislike comment without token', async () => {
        const response = await request(app)
        .post(`/comment/like/${idComment}`)
        assert.equal(response.body.message, 'Invalid token');
       
    });
});