const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = new Schema(
  {
    comment: { type: String, maxlength: 1000 },
    user_id: { type: Schema.Types.ObjectId },
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
        default: "create comment",
      },
    },
    is_delete: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "comment" }
);

module.exports = mongoose.model("Comment", Comment);
