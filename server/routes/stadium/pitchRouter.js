const router = require("express").Router();
const pitchController = require("../../controllers/stadium/pitchController");

router.get("/add", pitchController.getAddPitch);
router.post("/add", pitchController.postAddPitch);

module.exports = router;
