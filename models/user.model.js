const mongoose = require("mongoose");


mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String , unique : true , required : true , trim : true},
    password: { type: String, required : true , trim : true , minlength: 8   },
    name: { type: String , unique : true , required : true , trim : true },
    phone: { type: String , unique : true , required : true , trim : true },
    avatar: { type: String , required: true}
});

const user = new UserSchema.model('user', UserSchema);

module.exports = user ;
