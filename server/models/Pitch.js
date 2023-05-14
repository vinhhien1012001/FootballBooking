const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Pitch = new Schema(
  {
    name: { type: String, maxlength: 255 },
    category: { type: String, maxlength: 255 },
    stadium_id: { type: Schema.Types.ObjectId },

    // tracking information
    create_at: {
      type: Date,
      default: Date.now(),
    },
    update_at: {
      update_time: {
        type: Date,
        default: Date.now(),
      },
      update_content: {
        type: String,
        maxlength: 255,
        default: "create pitch",
      },
    },
    is_delete: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "pitch" }
);

module.exports = mongoose.model("Pitch", Pitch);
