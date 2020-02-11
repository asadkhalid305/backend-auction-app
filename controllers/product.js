const AppModel = require('../models/application');
const {
    emit
} = require('../socket')
const {
    client,
    success
} = require('../util/variables');

const newHighestBid = (req) => {
    return new Promise(function (resolve, reject) {
        AppModel.findOneAndUpdate({
                _id: req.headers.app_id,
                secret_key: req.headers.secret_key,
                'products._id': req.body.product._id
            }, {
                $set: {
                    'products.$.current_bid': req.body.newBid,
                    'products.$.highest_bidder': req.headers.user_id
                }
            }, {
                new: true
            }, (err, item) => {
                if (err) {
                    reject(err);
                } else
                    resolve(item)
            })
            .catch((err) => {
                reject(err);
            });
    });
}

const searchAppInDbById = (req) => {
    return new Promise(function (resolve, reject) {
        AppModel.findOne({
                _id: req.headers.app_id,
                secret_key: req.headers.secret_key,
            }, (err, item) => {
                if (err) {
                    reject(err);
                } else
                    resolve(item)
            })
            .catch((err) => {
                reject(err);
            });
    });
}

const Product = {
    updateBid: (req, res) => {
        newHighestBid(req)
            .then((products) => {
                emit('emitBid', products);
                res.status(success.accepted).send({
                    message: 'success',
                    details: 'bid updated'
                });
            })
            .catch((err) => {
                res.status(client.unAuthorized).send({
                    message: 'failed',
                    details: 'error in error in updating bid'
                })
            })
    },

    fetchProducts: (req, res) => {
        searchAppInDbById(req).then(app => {
            if (app) {
                res.status(success.accepted).send({
                    message: 'success',
                    details: "products found",
                    data: app.products
                });
            } else {
                res.status(client.notAcceptable).send({
                    message: 'failed',
                    details: `products not found`,
                })
            }
        }).catch((err) => {
            res.status(client.unAuthorized).send({
                message: 'failed',
                details: 'error in finding apps in db'
            })
        })
    },
}

module.exports = Product;