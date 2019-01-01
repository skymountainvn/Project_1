const assert = require('assert');
const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/user.model');
const { compare } = require('bcrypt');


describe('Test POST /sign in', () =>{

    beforeEach('Sign up a user for test', async () => {
        await User.signUp('hung3@gmail.com','123','hung1','1234567890');
    })  ; 

    it('Can sign in with email and password', async () => {
        const userInfo = {email: 'hung3@gmail.com', password: '123'};
        const reponse = await request(app).post('/user/signin').send(userInfo);
        assert.equal(reponse.status, 200);
        // console.log(reponse.body);
        assert.equal(reponse.body.success, true);
    });

    it('Cannot sign in with wrong email ', async () => {
        const userInfo = {email: 'asd@gmail.com', password: '123'};
        const reponse = await request(app).post('/user/signin').send(userInfo);
        assert.equal(reponse.status, 404);
        // console.log(reponse.body);
        assert.equal(reponse.body.success, false);
        assert.equal(reponse.body.code, 'CANNOT_FIND_USER');
    });

    it('Cannot sign in with wrong password ', async () => {
        const userInfo = {email: 'hung3@gmail.com', password: '321'};
        const reponse = await request(app).post('/user/signin').send(userInfo);
        assert.equal(reponse.status, 400);
        // console.log(reponse.body);
        assert.equal(reponse.body.success, false);
    });

    it('Cannot sign in without password ', async () => {
        const userInfo = {email: 'hung3@gmail.com'};
        const reponse = await request(app).post('/user/signin').send(userInfo);
        assert.equal(reponse.status, 400);
        // console.log(reponse.body);
        assert.equal(reponse.body.success, false);
    });

    it('Cannot sign in without email ', async () => {
        const userInfo = {};
        const reponse = await request(app).post('/user/signin').send(userInfo);
        assert.equal(reponse.status, 404);
        // console.log(reponse.body);
        assert.equal(reponse.body.success, false);
    });

});