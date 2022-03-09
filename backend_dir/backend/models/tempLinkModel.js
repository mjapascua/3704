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
    default: new Date(),
  },
});

tempLink.index({ createdAt: 1 }, { expireAfterSeconds: /* 6 * 3 */ 60 });

module.exports = mongoose.model("TempLink", tempLink);
