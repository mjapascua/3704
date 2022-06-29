const mongoose = require("mongoose");

const forRegistrationSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  used_by: {
    type: String,
  },
  registered_tag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RegisteredTag",
    default: null,
  },
  tag_uid: {
    type: String,
    default: null,
  },
  continue: {
    type: Boolean,
    default: false,
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
