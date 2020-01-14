const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    }
})

module.exports = Mongoose.model('user', userSchema);