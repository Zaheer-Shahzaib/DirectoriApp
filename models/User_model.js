const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
       require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    authType: {
        type: String,
        required: true,
        enum: ["Local", "google", "facebook"],
    },
    googleId: {
        type: String,
    },
})

module.exports = mongoose.model('User', userSchema)

//users