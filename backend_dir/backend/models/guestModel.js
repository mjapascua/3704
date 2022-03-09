const mongoose = require("mongoose");
const { ROLES } = require("../config/roles");

const guestSchema = mongoose.Schema(
  {
    patron: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    first_name: {
      type: String,
      required: [true, "Please add your given name"],
    },

    last_name: {
      type: String,
      required: [true, "Please add your surname"],
    },

    phone_number: {
      type: String,
      match: /^[0-9]*$/,
      minLength: 10,
      maxLength: 10,
      required: [true, "Please add a phone number"],
    },

    address: {
      type: String,
      required: [true, "Please add your residence"],
    },

    active: {
      type: Boolean,
    },

    last_disabled: {
      type: Date,
    },

    access_string: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GuestAccessString",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Guest", guestSchema);
