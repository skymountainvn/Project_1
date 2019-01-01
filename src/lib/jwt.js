const jwt = require('jsonwebtoken');

const SECRET_KEY = 'ncq42r17e8fq28';

function sign(obj) {
    return new Promise((resolve, reject) => {
        jwt.sign(obj, SECRET_KEY, { expiresIn: 60 * 60 }, (err, token) => {
            if (err) return reject(err);
            resolve(token);
        });
    });
}

function verify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET_KEY, (err, obj) => {
            if (err) return reject(err);
            delete obj.iat;
            delete obj.exp;
            resolve(obj);
        });
    })
}

module.exports = { sign, verify };