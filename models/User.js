const mongoose = require('mongoose');

const UserSchema1 = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('User', UserSchema1);