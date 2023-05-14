const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TimeBooking = new Schema(
  
  {
    time: { type: Date },
    pitch_id: { type: Schema.Types.ObjectId },
  },
  { collection: "timeBooking" }
);

module.exports = mongoose.model("TimeBooking", TimeBooking);
