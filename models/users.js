const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    //firstname : String,
    //lastname: String,
    email : String,
    password : String,
    //admin :
    //school_id : 

});

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel