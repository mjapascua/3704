const mongoose = require("mongoose");

const accessStringSchema = mongoose.Schema(
  {
    /*   user_type: {
      type: String,
      enum: ["User", "Guest"],
    }, */
    u_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    g_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
    },
    resident: {
      type: Boolean,
      default: null,
    },
    hash: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AccessString",
  accessStringSchema,
  "access_strings"
);
