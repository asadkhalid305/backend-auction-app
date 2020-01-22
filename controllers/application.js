const AppModel = require('../models/application');
const UserModel = require('../models/user');

const {
  client,
  success,
  server
} = require('../util/variables');

const {
  emailToken
} = require('../util/functions');

const searchAppInDbByName = (req) => {
  return new Promise(function (resolve, reject) {
    AppModel.findOne({
        name: req.body.name,
        user_id: req.headers.user_id,
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

const createNewApp = (req) => {
  return new Promise(function (resolve, reject) {
    const App = new AppModel({
      name: req.body.name,
      domain: req.body.domain,
      description: req.body.description,
      user_id: req.headers.user_id,
      secret_key: emailToken(10)
    });

    App.save().then((item) => {
      resolve(item);
    }).catch((err) => {
      reject(err);
    })
  })
}

const setUserAppId = (req) => {
  return new Promise(function (resolve, reject) {
    UserModel.updateOne({
        _id: req.headers.user_id
      }, {
        $addToSet: {
          application_id: req.body.application_id
        }
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

const getAllApps = (req) => {
  return new Promise(function (resolve, reject) {
    AppModel.findOne({
        _id: req.headers.app_id,
        secret_key: req.headers.secret_key
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

const addUsers = (req) => {
  return new Promise(function (resolve, reject) {
    AppModel.updateOne({
        _id: req.headers.app_id,
        secret_key: req.headers.secret_key
      }, {
        $addToSet: {
          registered_users: {
            $each: req.body.users
          }
        }
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

const addProducts = (req) => {
  return new Promise(function (resolve, reject) {
    AppModel.updateOne({
        _id: req.headers.app_id,
        secret_key: req.headers.secret_key
      }, {
        $addToSet: {
          products: {
            $each: req.body.products
          }
        }
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

const deleteApp = (req) => {
  return new Promise(function (resolve, reject) {
    AppModel.findOneAndRemove({
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

const Application = {
  add: (req, res) => {
    searchAppInDbByName(req).then((app) => {
      if (app) {
        res.status(client.notAcceptable).send({
          message: 'failed',
          data: {
            id: app._id,
            details: `app already exists for following name: ${app.name}`
          }
        })
      } else {
        createNewApp(req).then((app) => {
          if (app) {
            req.body.application_id = app.id;
            setUserAppId(req).then(() => {
                res.status(success.created).send({
                  message: 'success',
                  details: `application created for following name: ${app.name}`,
                  data: {
                    id: app._id,
                  }
                });
              })
              .catch((err) => {
                res.status(client.unAuthorized).send({
                  message: 'failed',
                  details: `error in updating app id in user`,
                  data: {
                    details: err
                  }
                });
              })
          } else {
            res.status(client.unAuthorized).send({
              message: 'failed',
              details: 'error in creating app',
              data: {
                details: err
              }
            });
          }
        }).catch((err) => {
          res.status(client.unAuthorized).send({
            message: 'failed',
            data: {
              details: err
            }
          })
        })
      }
    })
  },

  fetch: (req, res) => {
    getAllApps(req).then(apps => {
      if (apps.length > 0) {
        res.status(success.accepted).send({
          message: 'success',
          data: apps
        });
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

  remove: (req, res) => {
    deleteApp(req).then(app => {
        res.status(success.accepted).send({
          message: 'success',
          details: 'app deleted',
          data: app
        });
      })
      .catch((err) => {
        res.status(client.unAuthorized).send({
          message: 'failed',
          details: 'error in deleting app from db'
        })
      })
  },

  appendUsers: (req, res) => {
    searchAppInDbById(req).then(app => {
      if (app) {
        addUsers(req).then(() => {
          res.status(success.accepted).send({
            message: 'success',
            details: 'users added in app'
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

  appendProducts: (req, res) => {
    searchAppInDbById(req).then(app => {
      if (app) {
        addProducts(req).then(() => {
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

module.exports = Application;