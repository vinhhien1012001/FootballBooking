const Owner = require("../../models/Owner");

function getLogin(req, res) {
  res.render("authentication/login/login", { layout: false });
}

module.exports = {
  getLogin,
};
