const mongoose = require('mongoose');
 mongoose.connect('mongodb://localhost/asd123',{ useNewUrlParser: true });
 mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
 const userSchema = new Schema({
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    avatar: { type: String, required: true }
});
 const User = mongoose.model('User', userSchema);
 module.exports = User;