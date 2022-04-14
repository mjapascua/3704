const mongoose = require("mongoose");
const { notifTypes } = require("../config/notifTypes");
const { ROLES } = require("../config/roles");

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

    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
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

    main_unique: {
      type: String,
      required: true,
    },

    tag_uid: {
      type: String,
      default: null,
    },

    residence: {
      type: String,
      required: [true, "Please add your residence"],
    },

    password: {
      type: String,
      required: [true, "Please add a password"],
    },

    visitor_form_link: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TempLink",
    },

    guests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Guest",
      },
    ],
    notifications: [
      {
        ref_link: String,
        title: String,
        category: { type: String, enum: Object.values(notifTypes) },
        text: String,
        read_status: Boolean,
        created_at: Date,
      },
    ],
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
