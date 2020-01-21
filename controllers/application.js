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
        _id: req.body.app_id,
        secret_key: req.body.secret_key,
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
    AppModel.find({
        user_id: req.headers.user_id
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

const appendUsersInApp = (req) => {
  return new Promise(function (resolve, reject) {
    AppModel.updateOne({
        _id: req.body.app_id,
        secret_key: req.body.secret_key
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

  addUsers: (req, res) => {
    searchAppInDbById(req).then(app => {
      if (app) {
        appendUsersInApp(req).then(() => {
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
  }
}

module.exports = Application;