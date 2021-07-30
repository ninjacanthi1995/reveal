const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstname : String,
    //lastname: String,
    email : String,
    password : String,
    admin : String,
    school_id : String,
    // token: String
});

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel