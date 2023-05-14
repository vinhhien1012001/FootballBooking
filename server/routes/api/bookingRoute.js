const route = require("express").Router();
const bookingAPI = require("../../api/booking/booking");

route.post("/", bookingAPI.postBooking);
route.post("/userticket", bookingAPI.getUserTicket);
module.exports = route;
