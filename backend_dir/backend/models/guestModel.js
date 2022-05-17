const mongoose = require("mongoose");

const guestSchema = mongoose.Schema(
  {
    u_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    fname: {
      type: String,
      required: [true, "Please add your given name"],
    },

    lname: {
      type: String,
      required: [true, "Please add your surname"],
    },

    contact: {
      type: String,
      match: /^[0-9]*$/,
      minLength: 10,
      maxLength: 10,
      required: [true, "Please add a phone number"],
    },

    addr: {
      type: String,
      required: [true, "Please add your residence"],
    },

    qr: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccessString",
      default: null,
    },

    rf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegisteredTag",
      default: null,
    },

    active: {
      type: Boolean,
    },

    last_disabled: {
      type: Date,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Guest", guestSchema);
