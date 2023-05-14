const express = require("express");
const router = express.Router();
const registerController = require("../../controllers/authentication/registerController");

router.get("/", registerController.getRegister);
router.post("/", registerController.postRegister);

module.exports = router;
