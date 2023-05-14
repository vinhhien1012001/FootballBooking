const router = require("express").Router();
const stadiumController = require("../../controllers/stadium/stadiumController");

router.get("/", stadiumController.getListStadium);
router.get("/add", stadiumController.getAddStadium);
router.get("/edit/:id", stadiumController.getEditStadium);
router.get("/delete/:id", stadiumController.getDeleteStadium);

router.post("/add", stadiumController.postAddStadium);
router.post("/edit/:id", stadiumController.postEditStadium);

module.exports = router;