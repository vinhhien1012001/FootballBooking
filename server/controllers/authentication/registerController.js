const Owner = require("../../models/Owner");

function getRegister(req, res) {
  res.render("authentication/register/register", { layout: false });
}

function postRegister(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confPassword = req.body.confPassword;

  if (password != confPassword) {
    res.render("authentication/register/register", {
      layout: false,
      error: "Password incorrect",
    });
  }

  Owner.register({ email: email, name: name }, password, function (err, user) {
    if (err) {
      console.log(err);
      res.render("authentication/register/register", {
        layout: false,
        error: "Account was created",
      });
    } else {
      console.log("oke");
    }
  });
}

module.exports = {
  getRegister,
  postRegister,
};
