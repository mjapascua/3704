const mongoose = require("mongoose");

const RegisteredTagSchema = mongoose.Schema({
  u_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  g_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guest",
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
