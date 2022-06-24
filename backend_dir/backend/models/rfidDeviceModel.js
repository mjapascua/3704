const mongoose = require("mongoose");

const RFIDDeviceSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    scan_point: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ScanPoint",
      default: null,
    },
    device_label: {
      type: String,
      required: true,
    },
    device_key: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RFIDDevice", RFIDDeviceSchema, "rfid_devices");
