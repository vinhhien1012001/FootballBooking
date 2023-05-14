const router = require("express").Router();
const stadiumRouter = require("./stadiumRouter");
const pitchRouter = require("./pitchRouter");

router.use("/", stadiumRouter);
router.use("/pitches", pitchRouter);

module.exports = router;
