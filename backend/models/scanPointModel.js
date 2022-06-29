const mongoose = require("mongoose");

const ScanPointSchema = mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ScanPoint", ScanPointSchema, "scan_point");
