const mongoose = require("mongoose");

const RegisteredTagSchema = mongoose.Schema({
  patron: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
  used_by: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(
  "RegisteredTag",
  RegisteredTagSchema,
  "registered_tags"
);
