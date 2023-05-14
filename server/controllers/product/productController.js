const Ticket = require("../../models/Ticket");
const User = require("../../models/User");
const TimeBooking = require("../../models/TimeBooking");
const handleStripe = require("../../utils/stripe");
const sendMail = require("../../middleware/mail");

const handleTicket = {
  showTicket: async (req, res) => {
    const results = {};
    let page = Math.max(parseInt(req.query.page) || 1, 1);
    if (req.query.page == null) {
      page = 1;
    }

    const size = await Ticket.count({ is_delete: false });
    const limit = 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const tickets = await Ticket.find({ is_delete: false })
      .sort({ create_at: -1 })
      .skip(startIndex)
      .limit(limit);

    if (endIndex < size) {
      results.next = page + 1;
    }

    if (startIndex > 0) {
      results.previous = page - 1;
    }
    results.currentPage = page;

    let all_of_ticket = tickets;
    let nextPage = "/ticket" + "/show-ticket" + "?page=" + results.next;
    let currentPage =
      "/ticket" + "/show-ticket" + "?page=" + results.currentPage;
    let prevousPage = "/ticket" + "/show-ticket" + "?page=" + results.previous;

    let temp = [];
    for (let ticket of all_of_ticket) {
      const date = new Date(ticket.create_at);
      const object = {};
      let state;
      object.create_at =
        date.getDate() +
        " " +
        String(parseInt(date.getMonth()) + 1) +
        " " +
        date.getFullYear();
      if (ticket.not_paid) {
        state = "Not paid";
      } else {
        state = "Paid";
      }
      object._id = String(ticket._id);
      object.size = ticket.pitchs.length;
      object.not_paid = state;
      object.user_id = String(ticket.user_id);
      object.user_name = ticket.user_name;
      object.is_refund = ticket.is_refund;
      temp.push(object);
    }

    res.render("product/orderProduct.hbs", {
      tickets: temp,
      nextLink: nextPage,
      currentLink: currentPage,
      previousLink: prevousPage,
      next: results.next,
      currentPage: results.currentPage,
      previous: results.previous,
    });
  },

  deleteTicket: async (req, res) => {
    const ticketId = req.params.idTicket;

    try {
      const ticket = await Ticket.findById(ticketId);
      const user = await User.find({ _id: ticket.user_id, is_delete: false });

      if (!user) {
        return;
      }

      //reund money for user
      const dataRefund = await handleStripe.refundPayment(
        ticket.payment_intent
      );

      if (dataRefund !== "Success") {
        return;
      }

      // delete timeBooking of ticket
      ticket.pitchs.forEach(async (pitch) => {
        console.log(pitch);
        pitch.time.split(",").forEach(async (TIME) => {
          TimeBooking.findOne({
            pitch_id: pitch.pitch_id,
            time: new Date(TIME).toISOString(),
          }).then(async (booking) => {
            console.log(booking);
            await TimeBooking.deleteOne({ _id: booking._id });
          });
        });
      });

      await Ticket.updateOne(
        { _id: ticket._id },
        {
          is_refund: true,
          update_at: {
            update_time: Date.now(),
            update_content: "Ticket is deteted",
          },
        }
      );
      //send mail to notify user
      sendMail(
        "Ticket has been canceled",
        `I'm sorry, your ticket has been cancelled with ID_Ticket: ${ticket._id} and the amount has been refunded. Thank you.`
      );

      res.redirect("/ticket/show-ticket");
    } catch (e) {
      console.log(e);
      return res.redirect("/ticket/show-ticket");
    }
  },
};

module.exports = handleTicket;
