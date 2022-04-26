const mongoose = require("mongoose");

const accessStringSchema = mongoose.Schema(
  {
    user_type: {
      type: String,
      enum: ["User", "Guest"],
    },
    used_by: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "user_type",
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
