const mongoose = require("mongoose");
const { ROLES } = require("../config/roles");

const unverifiedAcc = mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, "Please add your given name"],
    },

    lname: {
      type: String,
      required: [true, "Please add your surname"],
    },

    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: [true, "Email is already taken"],
    },

    contact: {
      type: String,
      match: /^[0-9]*$/,
      minLength: 10,
      maxLength: 10,
      required: [true, "Please add a phone number"],
    },

    role: {
      type: String,
      enum: [...Object.values(ROLES), null],
      default: null,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    residence: {
      type: String,
      required: [true, "Please add your residence"],
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "UnverifiedAcc",
  unverifiedAcc,
  "unverified_accounts"
);
