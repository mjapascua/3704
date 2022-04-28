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
      required: true,
    },
    g_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
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
