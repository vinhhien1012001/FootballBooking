const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Price = new schema(
  {
    is_daytime: { type: Boolean },
    start_time: { type: Date },
    end_time: { type: Date },
    price: { type: Number },
    id_stadium: { type: schema.Types.ObjectId },

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
        default: "create price",
      },
    },
    is_delete: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "price" }
);

module.exports = mongoose.model("Price", Price);
