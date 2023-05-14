const redis = require("redis");
const env = require("../configs/envConfigs");
const Ticket = require("../models/Ticket");
const TimeBooking = require("../models/TimeBooking");
// let connect_redis = {
//   password: env.REDIS_PASSWORD,
//   socket: {
//     host: env.REDIS_HOSTNAME,
//     port: env.REDIS_PORT,
//   },
// };

let pub, sub;

pub = redis.createClient();
sub = redis.createClient();

pub.connect();
sub.connect();

pub.on("connect", () => {
  console.log("pub connect to redis");
});

sub.on("connect", () => {
  console.log("sub connect to redis");
});

sub.subscribe("__keyevent@0__:expired", async (message, channel) => {
  Ticket.findOne({
    _id: message,
  }).then(async (ticket) => {
    if (ticket.not_paid) {
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
          is_delete: true,
          update_at: {
            update_time: Date.now(),
            update_content: "Ticket is deteted",
          },
        }
      );
    }

  });
});

module.exports = { pub, sub };
