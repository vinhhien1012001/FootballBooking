const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Stadium = new schema(
  {
    name: { type: String, maxlength: 255 },
    image: { type: String },
    list_image: [],
    details: { type: String },
    address: { type: String, maxlength: 500 },
    list_id_pitch: [{ type: schema.Types.ObjectId }],
    ratting: { type: Number, default: 0 },

    // tracking information
    status: {
      type: String,
      default: "Open",
    },
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
        default: "create stadium",
      },
    },
    is_delete: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "stadium" }
);

module.exports = mongoose.model("Stadium", Stadium);
