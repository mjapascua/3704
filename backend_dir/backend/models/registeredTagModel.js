const mongoose = require("mongoose");

const RegisteredTagSchema = mongoose.Schema({
  user_type: {
    type: String,
    enum: ["User", "Guest"],
  },
  used_by: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "user_type",
  },
  uid: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(
  "RegisteredTag",
  RegisteredTagSchema,
  "registered_tags"
);
