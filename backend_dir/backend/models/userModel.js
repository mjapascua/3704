const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "Please add your given name"],
    },

    last_name: {
      type: String,
      required: [true, "Please add your surname"],
    },

    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: [true, "Email is already taken"],
    },

    phone_number: {
      type: String,
      match: /^[0-9]*$/,
      minLength: 10,
      maxLength: 10,
      required: [true, "Please add a phone number"],
    },

    residence: {
      type: String,
      required: [true, "Please add your residence"],
    },

    password: {
      type: String,
      required: [true, "Please add a password"],
    },

    guests: {
      type: Array,
      data: {
        accessString_id: { type: mongoose.Schema.Types.ObjectId },
        ref: "GuestAccessString",
      },
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
