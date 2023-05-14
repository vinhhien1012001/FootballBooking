const router = require("express").Router();
const ticketController = require("../../controllers/product/productController");

router.get("/show-ticket", ticketController.showTicket);
router.get("/delete-ticket/:idTicket", ticketController.deleteTicket);

module.exports = router;
