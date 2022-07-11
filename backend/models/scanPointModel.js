const mongoose = require("mongoose");

const ScanPointSchema = mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    scan_count: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ScanPoint", ScanPointSchema, "scan_point");
