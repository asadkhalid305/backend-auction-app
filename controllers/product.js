const AppModel = require('../models/application');

const {
    client,
    success,
    server
} = require('../util/variables');

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

const updateBid = (app) => {
    return new Promise(function (resolve, reject) {
        // AppModel.updateOne({
        //         _id: req.headers.app_id,
        //         secret_key: req.headers.secret_key
        //     }, {
        //         $addToSet: {
        //             products: {
        //                 $each: req.body.products
        //             }
        //         }
        //     }, (err, item) => {
        //         if (err) {
        //             reject(err);
        //         } else
        //             resolve(item)
        //     })
        //     .catch((err) => {
        //         reject(err);
        //     });

        app.products.forEach(el => {
            
        });
    });
}

const Product = {
    updateBid: (req, res) => {
        searchAppInDbById(req).then(app => {
            if (app) {
                updateBid(app).then(() => {
                    res.status(success.accepted).send({
                        message: 'success',
                        details: 'products added in app'
                    });
                })
            } else {
                res.status(client.notAcceptable).send({
                    message: 'failed',
                    details: `app not found`,
                })
            }
        }).catch((err) => {
            res.status(client.unAuthorized).send({
                message: 'failed',
                details: 'error in finding apps in db'
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