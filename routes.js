const
  User = require("./controllers/user");

const passport = require('passport');
const passportConfig = require('./passport')

var routes = (application) => {
  application.use((req, res, next) => {
    console.log("Routes activated!");
    console.log("Authenticating Developer");
    return next();
  });

  application.post("/signup", User.signup);
  application.post("/login", User.login);
  application.get("/rough", passport.authenticate('jwt', {
    session: false
  }), User.rough);

  application.use((req, res, next) => {
    res.status(404).send("Route not found!");
  });
};

module.exports = routes;