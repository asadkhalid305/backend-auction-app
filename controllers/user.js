const UserModel = require('../models/user');

const {
  client,
  success,
  server,
  token_expire
} = require('../util/variables');
const {
  createHash,
  compareHash,
  jwtToken,
  emailToken
} = require('../util/functions');

const sendEmail = require('../nodemailer')

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

const setPassword = (req) => {
  return new Promise(function (resolve, reject) {
    UserModel.findOneAndUpdate({
        _id: req.body.id,
        token: req.body.token
      }, {
        password: createHash(req.body.password)
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

const setUserToken = (email) => {
  return new Promise(function (resolve, reject) {
    const token = emailToken(4);
    let time = Date.now();
    time = Math.floor((time / 1000) + 60 * token_expire)

    UserModel.findOneAndUpdate({
        email: email
      }, {
        token: token,
        time: time
      }, (err, item) => {
        if (err) {
          reject(err);
        } else {
          item.token = token;
          resolve(item)
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

const isTokenValid = (req) => {
  return new Promise(function (resolve, reject) {
    let time = Date.now();
    time = time / 1000;

    UserModel.findOne({
        _id: req.body.id,
        token: req.body.token,
        time: {
          $gte: time
        }
      }, (err, item) => {
        if (err) {
          reject(err);
        } else {
          resolve(item)
        };
      })
      .catch((err) => {
        reject(err);
      });
  });
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
              jwtToken({
                  ...user
                })
                .then(token => {
                  res.status(success.created).send({
                    message: 'success',
                    details: `account created for following address: ${user.email}`,
                    data: {
                      id: user._id,
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
          jwtToken({
              ...user
            })
            .then(token => {
              res.status(success.accepted).send({
                message: 'success',
                details: `you have logged in via email from following address: ${user.email}`,
                data: {
                  id: user._id,
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

  passwordRecovery: {
    generateToken: (req, res) => {
      isUserExistInDb(req.query.email).then((user) => {
        if (user) {
          setUserToken(user.email).then(user => {
              sendEmail(user.email, user.token).then(() => {
                res.status(success.accepted).send({
                  message: 'success',
                  details: `token issued`,
                  data: {
                    id: user._id,
                    token: user.token
                  }
                })
              }).catch((err) => {
                res.status(server.serviceUnavailable).send({
                  message: 'failed',
                  data: {
                    details: 'user exist but email did not send'
                  }
                })
              })
            })
            .catch((err) => {
              res.status(server.serviceUnavailable).send({
                message: 'failed',
                data: {
                  details: 'error in soring token in database'
                }
              })
            })
        } else {
          res.status(client.notFound).send({
            message: 'user does not exist'
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
    verifyToken: (req, res) => {
      isTokenValid(req).then(user => {
        if (user) {
          res.status(success.accepted).send({
            message: 'success',
            details: `token verified`
          })
        } else {
          res.status(client.badRequest).send({
            message: 'failed',
            data: {
              details: "token doesn't exist in database or it has expired"
            }
          })
        }
      })
    },
    setNewPassword: (req, res) => {
      setPassword(req).then((user) => {
          if (user) {
            res.status(success.accepted).send({
              message: 'success',
              details: `password reset successfully`,
              data: {
                id: user._id,
                token: user.token
              }
            })
          } else {
            res.status(client.unAuthorized).send({
              message: 'error in updating PASSWORD',
              data: {
                details: err
              }
            })
          }
        })
        .catch(err => {
          res.status(client.badRequest).send({
            message: 'failed',
            data: {
              details: err
            }
          })
        })
    },
    rough: (req, res) => {
      console.log('asad');
    }
  }
}

module.exports = User;