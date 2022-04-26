const mongoose = require("mongoose");

const ScanPointSchema = mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ScanPoint", ScanPointSchema, "scan_point");
