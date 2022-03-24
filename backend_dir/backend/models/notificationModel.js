const mongoose = require("mongoose");
const { notifTypes } = require("../config/notifTypes");

const notifSchema = mongoose.Schema(
  {
    ref_link: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    type: {
      type: String,
      enum: Object.values(notifTypes),
    },
    read_status: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notifSchema);
