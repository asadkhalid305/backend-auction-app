/**
 * npm package and custom file import
 */
const UserModel = require('../models/user');

const {
  client,
  success
} = require('../util/variables');
const {
  createHash,
  compareHash,
  createToken
} = require('../util/functions');

/**
 * all database relation work here
 */
const isUserExistInDb = (email) => {
  return new Promise(function (resolve, reject) {
    UserModel.findOne({
        email: email
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

const createNewUser = (req) => {
  return new Promise(function (resolve, reject) {
    const user = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: createHash(req.body.password)
    });

    user.save().then((user) => {
      resolve(user);
    }).catch((err) => {
      reject(err);
    })
  })
}

/**
 * all logic here
 */
const User = {
  signup: (req, res) => {
    if (req.body.email && req.body.password) {
      isUserExistInDb(req.body.email).then((user) => {
        if (user) {
          res.status(client.notAcceptable).send({
            message: 'failed',
            data: {
              id: user._id,
              details: `user already exists for following address: ${user.email}`
            }
          })
        } else {
          createNewUser(req).then((user) => {
            if (user) {
              createToken({
                  ...user
                })
                .then(token => {
                  res.status(success.created).send({
                    message: 'success',
                    data: {
                      id: user._id,
                      token: token,
                      details: `account created for following address: ${user.email}`
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
      }).catch((err) => {
        if (err) {
          res.status(client.badRequest).send({
            message: 'failed',
            data: {
              details: err
            }
          })
        }
      })
    } else {
      res.status(client.badRequest).send({
        message: 'failed',
        data: {
          details: `email or password not found`
        }
      })
    }
  },
  login: (req, res) => {
    isUserExistInDb(req.body.email).then((user) => {
      if (user) {
        if (compareHash(req.body.password, user.password)) {
          createToken({
              ...user
            })
            .then(token => {
              res.status(success.accepted).send({
                message: 'success',
                data: {
                  id: user._id,
                  token: token,
                  details: `you have logged in via email from following address: ${user.email}`
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
              id: user._id,
              details: 'invalid email or password'
            }
          })
        }
      } else {
        res.status(client.notFound).send({
          message: 'user does not exists'
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
  },
  rough: (req, res) => {
    res.status(success.accepted).send({
      message: 'success',
      data: {
        details: `rough API`
      }
    })
  }
}

module.exports = User;