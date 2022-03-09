const mongoose = require("mongoose");

const tempLink = mongoose.Schema({
  unique: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    expires: "6h",
    default: Date.now,
  },
});

module.exports = mongoose.model("TempLink", tempLink);
