const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstname : {type: String, required: true},
    email : {type: String, unique: true, required: true},
    password : {type: String, required: true},
    role : {type: String, required: true},
    school_id : {type:mongoose.Schema.Types.ObjectId, ref: 'schools'},
});

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel