const
  User = require("./controllers/user");
const
  Application = require("./controllers/application");
const passport = require('passport');
const Express = require('express');


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

  recovery.get("/token/generate", User.passwordRecovery.generateToken);
  recovery.post("/token/verify", User.passwordRecovery.verifyToken);
  recovery.patch("/password/new", User.passwordRecovery.setNewPassword);

  auth.post("/signup", User.signup);
  auth.post("/login", User.login);

  app.get("/fetch", Application.fetch);
  app.post("/add", Application.add);
  app.delete("/remove", Application.remove);
  app.patch("/user/add", Application.appendUsers);
  app.patch("/product/add", Application.appendProducts);
  app.get("/product/fetch", Application.fetchProducts);


  application.use((req, res, next) => {
    res.status(404).send("Route not found!");
  });
};

module.exports = routes;