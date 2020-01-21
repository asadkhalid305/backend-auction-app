const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

const applicationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    secret_key: {
        type: String
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    registered_users: [{
        id: {
            type: String
        },
        name: {
            type: String
        }
    }]
})

module.exports = Mongoose.model('application', applicationSchema);