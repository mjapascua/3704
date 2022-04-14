const mongoose = require("mongoose");

const forRegistrationSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    expires: 21600, // 6 hours
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "ForRegistration",
  forRegistrationSchema,
  "registration_queue"
);
