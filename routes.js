const
  User = require("./controllers/user");
const passport = require('passport');
const passportConfig = require('./passport');
const Express = require('express');


var routes = (application) => {
  const recovery = Express.Router();
  const api = Express.Router();
  const auth = Express.Router();

  application.use((req, res, next) => {
    console.log("Routes activated!");
    console.log("Authenticating Developer");
    return next();
  });

  application.use('/recovery', recovery)
  application.use('/api', api)
  application.use('/auth', auth)

  recovery.post("/token/generate", User.passwordRecovery.generateToken);
  recovery.post("/token/verify", passport.authenticate('reset', {
    session: false
  }), User.passwordRecovery.verifyToken);
  recovery.post("/password/new", User.passwordRecovery.setNewPassword);


  auth.post("/signup", User.signup);
  auth.post("/login", User.login);

  api.get("/rough", passport.authenticate('global', {
    session: false
  }), User.passwordRecovery.rough);

  application.use((req, res, next) => {
    res.status(404).send("Route not found!");
  });
};

module.exports = routes;