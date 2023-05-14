const { pub, sub } = require("../../configs/connectRedis");
const TimeBooking = require("../../models/TimeBooking");
const Ticket = require("../../models/Ticket");
const User = require("../../models/User");
const StadiumModel = require("../../models/Stadium");
const PitchModel = require("../../models/Pitch");
const handlerStripe = require("../../utils/stripe");
const asyncLock = require("async-lock");
const mongoose = require("mongoose");
const lock = new asyncLock();

const booking = {
  postBooking: async (req, res) => {
    //Example
    /*
    INPUT:
    information_ticket = {
      [
      {
        pitch_id:...,
        time: ,
      }
      {
        pitch_id:...,
        time,
      }
      ],

      total:...
    }
    
    because input maybe have a lot of duplicate pitch_id
    {
      pitch_id:1
      time 6am
    }
    {
      pitch_id:1
      time: 7am
    }
    ===>
    PITCHS =[
      {
        pitch_id:1
        time:[6am, 7am]
      }
      {
        pitch_id:2
        time:[6am, 7am]
      }
    ]
    */
    const informationTicket = req.body.information_ticket;
    const totalPrice = req.body.total;
    const paymentType = req.body.payment;
    let linkPayment;

    //TODO: Lock critical section
    const release = await lock.acquire("booking", async () => {
      try {
        const pitchs = [];
        // TODO: check booking exists
        console.log(informationTicket);
        const conditions = {
          $or: informationTicket.map((item) => {
            const { price, ...rest } = item;
            return rest;
          }),
        };
        const existingBooking = await TimeBooking.findOne(conditions);
        if (existingBooking) {
          console.log("Booking is alreary exists");
          return res.status(404).json({
            state: "error",
            error: "Booking is alreary exists",
          });
        }

        //TODO: grouping by pitch id and aggregating times
        for (const i of informationTicket) {
          let check = pitchs.find((element) => element.pitch_id === i.pitch_id);

          if (check === undefined) {
            const temp = { ...i };
            pitchs.push(temp);
          } else {
            check.time += "," + i.time;
          }
        }
        // for (let i = 0; i < informationTicket.length; i++) {
        //   const temp ={};
        //   const {pitch_id,time,price} = informationTicket[i];
        //   temp.pitch_id = pitch_id;
        //   temp.time = time;
        //   temp.price = price;

        //   let check = pitchs.find(element =>{
        //     if (element.pitch_id){

        //     }
        //   })
        // }

        //TODO: find user and  create ticket with is_paid = false
        const user = await User.findById(req.body.user_id);

        console.log("USER!!", user);

        const createTicket = new Ticket({
          pitchs: pitchs,
          price: totalPrice,
          is_delete: false,
          not_paid: true,
          total: totalPrice,
          user_id: user._id,
          user_name: user.user_name,
        });

        createTicket.save().then(async (data) => {
          //TODO: create link payment
          if (paymentType == "stripe") {
            linkPayment = await handlerStripe.stripePayment(
              data._id,
              req.body.information_ticket
            );
            if (linkPayment.status == "Error") {
              return res.status(404).json({ error: `Error` });
            }
          }

          for (let i = 0; i < data.pitchs.length; i++) {
            let timeofpitchs = data.pitchs[i].time.split(",");
            for (let j = 0; j < timeofpitchs.length; j++) {
              const booking_time = new TimeBooking({
                time: new Date(timeofpitchs[j]).toISOString(),
                pitch_id: data.pitchs[i].pitch_id,
              });
              await booking_time.save();
            }
          }
          try {
            // push information_ticket in redis
            await pub.configSet("notify-keyspace-events", "Ex");
            await pub.setEx(String(data._id), 20, "hello");
          } catch (err) {
            console.log(err);
            return res.status(404).json({
              state: "error",
              error: err,
            });
          }
          // return respont status 200
          return res.status(200).json({
            state: "successfully",
            url: linkPayment.url,
          });
        });
      } catch (err) {
        console.log(err);
        return res.status(404).json({
          state: "error",
          error: err,
        });
      }
    });
  },

  // getUserTicket: async (req, res) => {
  //   const user_id = new mongoose.Types.ObjectId(req.body.user_id);
  //   const user_ticket = await Ticket.find({
  //     user_id: user_id,
  //   });

  //   if (!user_ticket) {
  //     return res.json({
  //       message: "user didn't order any ticket",
  //     });
  //   }

  //   return res.json({
  //     order_ticket: user_ticket,
  //   });
  // },

  // getUserTicket: async (req, res) => {
  //   const user_id = new mongoose.Types.ObjectId(req.body.user_id);
  //   let stadium;
  //   let category;
  //   const user_ticket = await Ticket.findOne({
  //     user_id: user_id,
  //   });

  //   const pitchs = user_ticket.pitchs;

  //   const p = await PitchModel.findById(pitchs[0].pitch_id);
  //   category = p.category;
  //   console.log(p);
  //   const t = await StadiumModel.findOne({
  //     _id: p.stadium_id,
  //   });
  //   console.log(t);
  //   stadium = t.name;
  //   console.log(category, stadium);

  //   if (!user_ticket) {
  //     return res.json({
  //       message: "user didn't order any ticket",
  //     });
  //   }

  //   return res.json({
  //     order_ticket: user_ticket,
  //     stadium: stadium,
  //     category: category,
  //   });
  // },
  getUserTicket: async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.body.user_id);

    const infor_ticket = [];
    const user_ticket = await Ticket.find({
      user_id: user_id,
    });

    if (!user_ticket) {
      return res.json({
        message: "user didn't order any ticket",
      });
    }

    const number_of_time = function () {
      let count = 0;
      user_ticket.forEach((ticket) => {
        ticket.pitchs.forEach(async (pitch) => {
          pitch.time.split(",").forEach(async (TIME) => {
            count++;
          });
        });
      });
      return count;
    };

    user_ticket.forEach((ticket) => {
      ticket.pitchs.forEach(async (pitch) => {
        pitch.time.split(",").forEach(async (TIME) => {
          let temp = {};
          console.log(pitch.pitch_id);
          const p = await PitchModel.findById(pitch.pitch_id);

          const t = await StadiumModel.findOne({ _id: p.stadium_id });

          const time = new Date(TIME);
          temp.stadium = t.name;
          temp.category = p.category;
          temp.time = time.toUTCString();
          temp.price = pitch.price;
          temp.ticket_id = ticket._id;
          infor_ticket.push(temp);
          if (infor_ticket.length == number_of_time())
            return res.status(200).json({
              data: infor_ticket,
            });
        });
      });
    });
  },

  deleteUserTicket: async (req, res) => {
    const id_ticket = req.body.ticket_id;
    const ticket = await Ticket.findOne({ _id: id_ticket });
    const date_now = Date.now();
    const date_order = ticket.create_at;
    try {
      if (date_order.getDay() - date_now.getDay() >= 2) {
        ticket.pitchs.forEach(async (pitch) => {
          pitch.time.split(",").forEach(async (TIME) => {
            TimeBooking.find({
              pitch_id: pitch.pitch_id,
              time: new Date(TIME),
            }).then();
          });
        });
        return res.json({
          message: "Delete successfully",
        });
      } else {
        return res.json({
          message: "Delete failed",
        });
      }
    } catch (err) {}
  },
};

// const booking = {
//   postBooking: async (req, res) => {
//     //Example
//     /*
//     INPUT:
//     information_ticket = {
//       [
//       {
//         pitch_id:...,
//         time: ,
//       }
//       {
//         pitch_id:...,
//         time,
//       }
//       ],

//       total:...
//     }

//     because input maybe have a lot of duplicate pitch_id
//     {
//       pitch_id:1
//       time 6am
//     }
//     {
//       pitch_id:1
//       time: 7am
//     }
//     ===>
//     PITCHS =[
//       {
//         pitch_id:1
//         time:[6am, 7am]
//       }
//       {
//         pitch_id:2
//         time:[6am, 7am]
//       }
//     ]
//     */

//     const informationTicket = req.body.information_ticket;
//     const totalPrice = req.body.total;
//     const paymentType = req.body.payment;
//     let linkPayment;

//     try {
//       const pitchs = [];
//       // TODO: check booking exists
//       console.log(informationTicket);
//       const conditions = {
//         $or: informationTicket.map((item) => {
//           const { price, ...rest } = item;
//           return rest;
//         }),
//       };
//       const existingBooking = await TimeBooking.findOne(conditions);
//       if (existingBooking) {
//         console.log("Booking is alreary exists");
//         return res.status(404).json({
//           state: "error",
//           error: "Booking is alreary exists",
//         });
//       }

//       //TODO: grouping by pitch id and aggregating times
//       for (const i of informationTicket) {
//         let check = pitchs.find((element) => element.pitch_id === i.pitch_id);

//         if (check === undefined) {
//           const temp = { ...i };
//           pitchs.push(temp);
//         } else {
//           check.time += "," + i.time;
//         }
//       }
//       // for (let i = 0; i < informationTicket.length; i++) {
//       //   const temp ={};
//       //   const {pitch_id,time,price} = informationTicket[i];
//       //   temp.pitch_id = pitch_id;
//       //   temp.time = time;
//       //   temp.price = price;

//       //   let check = pitchs.find(element =>{
//       //     if (element.pitch_id){

//       //     }
//       //   })
//       // }

//       //TODO: create ticket with is_paid = false
//       const createTicket = new Ticket({
//         pitchs: pitchs,
//         price: totalPrice,
//         is_delete: false,
//         not_paid: true,
//         total: totalPrice,
//       });

//       createTicket.save().then(async (data) => {
//         //TODO: create link payment
//         if (paymentType == "stripe") {
//           linkPayment = await handlerStripe.stripePayment(
//             data._id,
//             req.body.information_ticket
//           );
//           if (linkPayment.status == "Error") {
//             return res.status(404).json(linkPayment);
//           }
//         }

//         for (let i = 0; i < data.pitchs.length; i++) {
//           let timeofpitchs = data.pitchs[i].time.split(",");
//           for (let j = 0; j < timeofpitchs.length; j++) {
//             const booking_time = new TimeBooking({
//               time: new Date(timeofpitchs[j]).toISOString(),
//               pitch_id: data.pitchs[i].pitch_id,
//             });
//             await booking_time.save();
//           }
//         }
//         try {
//           // push information_ticket in redis
//           await pub.configSet("notify-keyspace-events", "Ex");
//           await pub.setEx(String(data._id), 20, "hello");
//         } catch (err) {
//           console.log(err);
//         }

//         // return respont status 200
//         return res.status(200).json({
//           state: "successfully",
//           url: linkPayment.url,
//         });
//       });
//     } catch (err) {
//       console.log(err);
//       return res.status(404).json({
//         state: "error",
//         error: err,
//       });
//     }
//   },
// };

module.exports = booking;
