const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const paymentController = require("../../controllers/payment/payment");

router.post(
  "/webhook",
  bodyParser.raw({ type: "*/*" }),
  paymentController.paymentStripeWebhook
);

module.exports = router;
