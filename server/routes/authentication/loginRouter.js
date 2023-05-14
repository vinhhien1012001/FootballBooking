const express = require("express");
const router = express.Router();
const loginController = require("../../controllers/authentication/loginController");
const passport = require("passport");

router.get("/", loginController.getLogin);
router.post(
  "/",
  passport.authenticate("local", { failureRedirect: "/auth/login" }),
  function (req, res) {
    console.log(req.user.id);
    res.redirect("/dashboard");
  }
);

module.exports = router;
