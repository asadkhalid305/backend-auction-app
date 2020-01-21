const
  User = require("./controllers/user");
const
  Application = require("./controllers/application");
const passport = require('passport');
const Express = require('express');
const passportConfig = require('./passport');


var routes = (application) => {
  const recovery = Express.Router();
  const api = Express.Router();
  const auth = Express.Router();
  const app = Express.Router();

  application.use((req, res, next) => {
    console.log("Routes activated!");
    console.log("Authenticating Developer");
    return next();
  });

  application.use('/recovery', recovery)
  application.use('/api', api)
  application.use('/auth', auth)
  application.use('/app', app)

  recovery.post("/token/generate", User.passwordRecovery.generateToken);
  recovery.post("/token/verify", User.passwordRecovery.verifyToken);
  recovery.post("/password/new", User.passwordRecovery.setNewPassword);

  auth.post("/signup", User.signup);
  auth.post("/login", User.login);

  app.post("/create", Application.create);

  application.use((req, res, next) => {
    res.status(404).send("Route not found!");
  });
};

module.exports = routes;