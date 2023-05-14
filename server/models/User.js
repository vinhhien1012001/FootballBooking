const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const User = new Schema(
  {
    email: { type: String, maxlength: 255 },
    password: { type: String, maxlength: 255 },
    user_name: { type: String, maxlength: 255 },

    phone: { type: String, default: "**********", maxlength: 11 },

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
  { collection: "user" }
);

User.plugin(passportLocalMongoose, {
  usernameField: "email",
});

module.exports = mongoose.model("User", User);
