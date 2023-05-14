const router = require("express").Router();
const loginRouter = require("./loginRouter");
const registerRouter = require("./registerRouter");

router.use("/login", loginRouter);
router.use("/register", registerRouter);

module.exports = router;
