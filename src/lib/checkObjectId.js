const mongoose = require('mongoose');
const MyError = require('./MyError');

function checkObjectId(ids) {
    try {
        ids.forEach(id => new mongoose.Types.ObjectId(id.toString()));
    } catch (error) {
        throw new MyError('Invalid id', 'INVALID_ID', 400);
    }
}

module.exports = { checkObjectId };