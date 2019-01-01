const assert = require('assert');
const request = require('supertest');
const { compare } = require('bcrypt');

const app = require('../../src/app');
const User = require('../../src/models/user.model');

describe('TEST POST /user/check', () => {
    let token;
    beforeEach('Sign up a user for test', async () => {
        await User.signUp('hung3@gmail.com','123','hung1','1234567890');
        const user = await User.signIn('hung3@gmail.com','123');
        token = user.token;

    });

    it('Can verify token by POST /user/check ', async () => {
        const response = await request(app)
        .post('/user/check')
        .set({ token})
        // console.log(response.body);
        assert.equal(response.status,200);
        assert.equal(response.body.user.name,'hung1');
        assert.equal(response.body.success,true);
    }); 

    it('Cannot verify wrong token ', async () => {
        const response = await request(app)
        .post('/user/check')
        .set({ token: 'a.b'})
        // console.log(response.body);
        assert.equal(response.status,400);
        assert.equal(response.body.success,false);
    }); 

}); 