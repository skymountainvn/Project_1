const mongoose = require('mongoose');
const { hash, compare } = require('bcrypt');
// const bcrypt = require("bcrypt")
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/asd123',{ useNewUrlParser: true });
// mongoose.connect('mongodb://localhost/asd123',{useMongoClient: true});
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, trim: true,index: true },
    password: { type: String, required: true, trim: true,index: true },
    name: { type: String, required: true,index: true },
    phone: { type: String, required: true,index: true },
    avatar: { type: String, required: true,index: true }
});


const UserModel = mongoose.model('User', userSchema);

class User extends UserModel {


    static async signUp(email, password, name, phone, avatar)  {
        const encrypted = await hash(password, 8);
        const user = new UserModel({ name, email, password: encrypted, phone, avatar });
        return user.save();
    }

    static async signIn(email, password) {
        const user = await User.findOne({ email });
        if (!user) throw new Error('Cannot find user.');
        const same = await compare(password, user.password);
        if (!same) throw new Error('Invalid password.');
        return user;
    }
}

module.exports = User;
