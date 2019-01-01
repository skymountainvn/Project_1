const mongoose = require('mongoose');
const { hash, compare } = require('bcrypt');
const {sign, verify} = require('../lib/jwt');
const MyError = require('../lib/MyError');
const {     MISSING_EMAIL, CANNOT_FIND_USER, INVALID_PASSWORD, EMAIL_EXISTED, INVALID_SIGN_UP_INFO} = require('../lib/errorCode');

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    stories: [{ type: Schema.Types.ObjectId, ref: 'Story'}],
    incommingRequests: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    sentRequests: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User'}]
});

const UserModel = mongoose.model('User', userSchema);

class User extends UserModel {
    static async signUp(email, password, name, phone) {
        if(typeof password !== 'string') throw new MyError('Password is required', INVALID_PASSWORD, 400);
        const encrypted = await hash(password, 8)
        const user = new UserModel({ name, email, password: encrypted, phone });
        await user.save()
        .catch(error => { 
            if(error.code === 11000) throw new MyError('Email existed', EMAIL_EXISTED,400);
            throw new MyError('Invalid sign up info.', INVALID_SIGN_UP_INFO,400);
        });
        const userInfo =  user.toObject();
        delete userInfo.password;
        return userInfo;
    }
    
    static async signIn(email, password) {
        const user = await User.findOne({ email });
        if (!user) throw new MyError('Cannot find user.',CANNOT_FIND_USER, 404);
        const same = await compare(password, user.password)
        .catch( () => { throw new MyError('Invalid password.',INVALID_PASSWORD, 400)}); // trường hợp password = undefined throw vào đây
        if (!same) throw new MyError('Invalid password.',INVALID_PASSWORD, 400);
        const userInfo =  user.toObject();
        const token = await sign({ _id: user._id });
        userInfo.token = token;
        delete userInfo.password;
        return userInfo;
    }


    static async check(idUser) {
        const user = await User.findById(idUser);
        if (!user) throw new MyError('Cannot find user.', CANNOT_FIND_USER, 404);
        const userInfo = user.toObject();
        const token = await sign({ _id: user._id });
        userInfo.token = token;
        delete userInfo.password;
        return userInfo;
    }

    static async sendFriendRequest(idSender, idReceiver) {
        const sender = await User.findByIdAndUpdate(idSender, { $addToSet: { sentRequests: idReceiver} })
        .catch(error => { throw new MyError('Cannot find sender.','CANNOT_FIND_SENDER',404) });
        if(!sender) throw new MyError('Cannot find sender.','CANNOT_FIND_SENDER',404);
        const receiver = await User.findByIdAndUpdate(idReceiver, { $addToSet: { incommingRequests: idSender} }).select(['name', 'stories'])
        .catch(error => { throw new MyError('Cannot find receiver.','CANNOT_FIND_RECEIVER',404) });
        if(!receiver) throw new MyError('Cannot find receiver.','CANNOT_FIND_RECEIVER',404);
        return receiver;
        
    }

    static async sendFriendRequest(idSender, idReceiver) {
        const sender = await User.findByIdAndUpdate(idSender, { $addToSet: { sentRequests: idReceiver } })
        .catch(error => { throw new MyError('Cannot find sender.', 'CANNOT_FIND_SENDER', 404); });
        if (!sender) throw new MyError('Cannot find sender.', 'CANNOT_FIND_SENDER', 404); 
        const receiver = await User.findByIdAndUpdate(idReceiver, { $addToSet: { incommingRequests: idSender } }).select(['name', 'stories'])
        .catch(error => { throw new MyError('Cannot find receiver.', 'CANNOT_FIND_RECEIVER', 404); });
        if (!receiver) throw new MyError('Cannot find receiver.', 'CANNOT_FIND_RECEIVER', 404); 
        return receiver;
    }

    static async acceptFriendRequest(idReceiver, idSender) {
        const isRequestSent = await User.findOne({ _id: idReceiver, incommingRequests: { $all: [idSender] } })
        if (!isRequestSent) throw new MyError('Cannot find sender.', 'CANNOT_FIND_SENDER', 404);
        const sender = await User.findByIdAndUpdate(idSender, { $pull: { sentRequests: idReceiver }, $addToSet: { friends: idReceiver } })
        .catch(error => { throw new MyError('Cannot find sender.', 'CANNOT_FIND_SENDER', 404); });
        if (!sender) throw new MyError('Cannot find sender.', 'CANNOT_FIND_SENDER', 404); 
        const receiver = await User.findByIdAndUpdate(idReceiver, { $pull: { incommingRequests: idSender }, $addToSet: { friends: idSender } }).select(['name', 'stories'])
        .catch(error => { throw new MyError('Cannot find receiver.', 'CANNOT_FIND_RECEIVER', 404); });
        if (!receiver) throw new MyError('Cannot find receiver.', 'CANNOT_FIND_RECEIVER', 404); 
        return sender;
    }

    static async removeFriend(idUser, idFriend) {
        const user = await User.findByIdAndUpdate(idUser, { $pull: { friends: idFriend } })
        .catch(error => { throw new MyError('Cannot find sender.', 'CANNOT_FIND_USER', 404); });
        if (!user) throw new MyError('Cannot find sender.', 'CANNOT_FIND_USER', 404); 
        const friend = await User.findByIdAndUpdate(idFriend, { $pull: { friends: idUser } }).select(['name', 'stories'])
        .catch(error => { throw new MyError('Cannot find receiver.', 'CANNOT_FIND_FRIEND', 404); })
        if (!friend) throw new MyError('Cannot find receiver.', 'CANNOT_FIND_FRIEND', 404); 
        return friend;
    }

}

module.exports = User;