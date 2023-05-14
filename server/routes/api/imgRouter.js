const router = require("express").Router();
const img = require("../../middleware/uploadImage");

router.get("/:name", img.download);

module.exports = router;
