const router = require("express").Router();
const stripeRouter = require("./stripeRouter");

router.use("/stripe", stripeRouter);

module.exports = router;
