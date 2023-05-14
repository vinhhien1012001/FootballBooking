const router = require("express").Router();
const dashboardController = require("../../controllers/dashboard/dashboardController");

router.get("/dashboard", dashboardController.getDashBoard)


module.exports = router;
