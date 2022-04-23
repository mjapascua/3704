const mongoose = require("mongoose");

const RFIDDeviceSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    device_label: {
      type: String,
      required: true,
    },
    device_key: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RFIDDevice", RFIDDeviceSchema, "rfid_devices");
