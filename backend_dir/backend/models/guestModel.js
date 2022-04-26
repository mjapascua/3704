const mongoose = require("mongoose");

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

    qr: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "AccessString",
      default: null,
    },

    rfid: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "RegisteredTag",
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
