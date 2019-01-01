const assert = require('assert');
const request = require('supertest');
const { compare } = require('bcrypt');

const app = require('../../src/app');
const User = require('../../src/models/user.model');

describe('Test POST /signup', () => {
    it('Can sign up with full info', async () => {
            const userInfo = {
            email: 'hung1@gmail.com',
            password: '123',
            name: 'hung1',
            phone: '123456789'
        };
        const response = await request(app).post('/user/signup').send(userInfo);
        assert.equal(response.status, 200);
        assert.equal(response.body.success, true);
        assert.equal(response.body.user.name, 'hung1');
        assert.equal(response.body.user.email, 'hung1@gmail.com');
        const users = await User.find({});
        assert.equal(users.length, 1);
        const { email, password, name, phone } = users[0];
        assert.equal(email, 'hung1@gmail.com');
        assert.equal(name, 'hung1');
        assert.equal(phone, '123456789');
        const same = await compare('123', password);
        assert.equal(same, true);
    });

    it('Cannot sign up without email', async () => {
            const userInfo = {
            password: '123',
            name: 'hung1',
            phone: '123456789'
        };
        const response = await request(app).post('/user/signup').send(userInfo);

        assert.equal(response.status, 400);
        assert.equal(response.body.success, false);
    });

    it('Cannot sign up with existed email', async () => {
        await User.signUp('hung1@gmail.com', '123', 'hung1', '123456789');
            const userInfo = {
            email: 'hung1@gmail.com',
            password: '123',
            name: 'hung1',
            phone: '123456789'
        };
        const response = await request(app).post('/user/signup').send(userInfo);
        assert.equal(response.status, 400);
        assert.equal(response.body.success, false);
    });
});