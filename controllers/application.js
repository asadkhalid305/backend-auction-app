const ApplicationModel = require('../models//application');
const UserModel = require('../models/user');

const {
  client,
  success,
  server
} = require('../util/variables');

const isApplicationExistInDb = (name) => {
  return new Promise(function (resolve, reject) {
    ApplicationModel.findOne({
        name: name
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

const createNewApplication = (req) => {
  return new Promise(function (resolve, reject) {
    const application = new ApplicationModel({
      name: req.body.name,
      domain: req.body.domain,
      description: req.body.description,
      user_id: req.body.user_id
    });

    application.save().then((item) => {
      resolve(item);
    }).catch((err) => {
      reject(err);
    })
  })
}

const setUserApplicationId = (req) => {
  return new Promise(function (resolve, reject) {
    UserModel.updateOne({
        _id: req.body.user_id
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

const Application = {
  create: (req, res) => {
    isApplicationExistInDb(req.body.name).then((app) => {
      if (app) {
        res.status(client.notAcceptable).send({
          message: 'failed',
          data: {
            id: app._id,
            details: `app already exists for following name: ${app.name}`
          }
        })
      } else {
        createNewApplication(req).then((app) => {
          if (app) {
            req.body.application_id = app.id;
            setUserApplicationId(req).then(() => {
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

  login: (req, res) => {
    isApplicationExistInDb(req.body.email).then((application) => {
      if (application) {
        if (compareHash(req.body.password, application.password)) {
          jwtToken({
              ...application
            })
            .then(token => {
              res.status(success.accepted).send({
                message: 'success',
                details: `you have logged in via email from following address: ${application.email}`,
                data: {
                  id: application._id,
                  token: token,
                }
              })
            })
            .catch(err => {
              res.status(client.unAuthorized).send({
                message: 'error in generating token',
                data: {
                  details: err
                }
              })
            })
        } else {
          res.status(client.unAuthorized).send({
            message: 'failed',
            data: {
              id: application._id,
              details: 'invalid email or password'
            }
          })
        }
      } else {
        res.status(client.notFound).send({
          message: 'application does not exists'
        })
      }
    }).catch((err) => {
      res.status(client.badRequest).send({
        message: 'failed',
        data: {
          details: err
        }
      })
    })
  }
}

module.exports = Application;