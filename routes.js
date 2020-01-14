const User = require("./controllers/user");
var jwt = require("jsonwebtoken");

var routes = application => {
  application.use((req, res, next) => {
    console.log("Routes activated!");
    console.log("Authenticating Developer");
    return next();
  });

  application.get("/app/status", function (req, res) {
    res.status(200).send({
      message: "success",
      data: `App is up and running`
    });
  });

  // application.get("/jwt/token", function (req, res) {
  //   jwt.sign({
  //     foo: "bar"
  //   }, 'privateKey', function (
  //     err,
  //     token
  //   ) {
  //     res.status(200).send({
  //       message: "success",
  //       token
  //     });
  //   });
  // });

  application.post("/signup", User.signup);
  application.post("/login", User.login);

  application.use((req, res, next) => {
    res.status(404).send("Route not found!");
  });
};

module.exports = routes;