const
  User = require("./controllers/user");
const
  Application = require("./controllers/application");
const
  Product = require("./controllers/product");
const passport = require('passport');
const passportConfig = require('./passport')

const Express = require('express');


var routes = (application) => {
  const recovery = Express.Router();
  const auth = Express.Router();
  const app = Express.Router();
  const product = Express.Router();
  const user = Express.Router();
  const api = Express.Router();

  application.use((req, res, next) => {
    console.log("Routes activated!");
    console.log("Authenticating Developer");
    return next();
  });

  application.use('/recovery', recovery)
  application.use('/auth', auth)
  application.use('/app', app)
  application.use('/product', product)
  application.use('/user', user)
  application.use('/api', api)

  recovery.get("/token/generate", User.passwordRecovery.generateToken);
  recovery.post("/token/verify", User.passwordRecovery.verifyToken);
  recovery.patch("/password/new", User.passwordRecovery.setNewPassword);

  auth.post("/signup", User.signup);
  auth.post("/login", User.login);
  auth.post("/app", Application.authenticate);

  app.get("/", Application.fetch);
  app.post("/add", Application.add);
  app.delete("/remove", Application.remove);
  app.patch("/user/add", Application.appendUsers);
  app.patch("/product/add", Application.appendProducts);

  product.get("/", passport.authenticate('jwt', {
    session: false
  }), Product.fetchProducts);

  product.patch('/bid', Product.updateBid);

  application.use((req, res, next) => {
    res.status(404).send("Route not found!");
  });
};

module.exports = routes;