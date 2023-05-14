const mongoose = require("mongoose");
const schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const Owner = new schema(
  {
    email: { type: String, maxlength: 255 },
    password: { type: String, maxlength: 255 },
    name: { type: String, maxlength: 255 },
    address: { type: String, maxlength: 255 },

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
        default: "create account",
      },
    },
    is_delete: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "owner" }
);

Owner.plugin(passportLocalMongoose, {
  usernameField: "email",
});

module.exports = mongoose.model("Owner", Owner);
