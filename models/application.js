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
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        }
    }],
    products: [{
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        initial_bid: {
            type: String,
            required: true
        },
        current_bid: {
            type: String,
            required: true
        },
        highest_bidder: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        expire: {
            type: String,
            required: true
        }
    }],
    isActive: {
        type: Boolean
    },
})

module.exports = Mongoose.model('application', applicationSchema);