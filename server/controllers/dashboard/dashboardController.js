const User = require("../../models/User");
const Ticket = require("../../models/Ticket");

async function getDashBoard(req, res) {
  const countUser = await User.countDocuments({ is_delete: false });
  const countTicket = await Ticket.countDocuments({ is_delete: false });
  const total = await Ticket.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$price' }
      }
    }
  ])

  const currentYear = new Date().getFullYear(); // Lấy năm hiện tại

  const countTicketMonth = await Ticket.aggregate([
    {
      $match: {
        create_at: {
          $gte: new Date(currentYear, 0, 1), // Ngày bắt đầu của năm hiện tại
          $lt: new Date(currentYear + 1, 0, 1), // Ngày đầu năm của năm tiếp theo
        },
      },
    },
    {
      $group: {
        _id: { $month: "$create_at" }, // Nhóm theo tháng
        count: { $sum: 1 }, // Đếm số lượng vé
        totalAmount: { $sum: '$price' }
      },
    },
  ])



  res.render("dashboard/dashboard", {
    layout: false,
    data: {
      countTicket: countTicket,
      countUser: countUser,
      total: total[0].totalAmount,
      countTicketMonth: countTicketMonth
    }
  });
}

module.exports = {
  getDashBoard,
};