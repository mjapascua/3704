const mongoose = require("mongoose");

const accessStringSchema = mongoose.Schema(
  {
    patron: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    used_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
    },
    hash: {
      type: String,
    },
    scanHistory: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GuestAccessString", accessStringSchema);
