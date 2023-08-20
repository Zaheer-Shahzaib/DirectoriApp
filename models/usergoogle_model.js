const mongoose=require('mongoose')
const Schema=mongoose.Schema
const userGoogleSchema= new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    googleId: {
        type: String,
    },
})

module.exports=mongoose.model('userGoogle', userGoogleSchema)