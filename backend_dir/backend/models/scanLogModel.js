const mongoose = require("mongoose");

const ScanLogSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["rfid", "qr"],
    },
    tag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegisteredTag",
      required: function () {
        return this.type === "rfid" ? true : false;
      },
    },
    qr: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccessString",
      required: function () {
        return this.type === "qr" ? true : false;
      },
    },
    from_reader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RFIDDevice",
      required: function () {
        return this.type === "rfid" ? true : false;
      },
    },
    from_account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.type === "qr" ? true : false;
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ScanLog", ScanLogSchema, "scan_logs");
