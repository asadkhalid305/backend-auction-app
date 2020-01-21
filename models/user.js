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
    },
    token: {
        type: String
    },
    time: {
        type: String
    },
    application_id: [{
        type: Schema.Types.ObjectId,
        ref: 'application',
        required: false

    }]
})

module.exports = Mongoose.model('user', userSchema);