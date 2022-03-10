const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  if (users) {
    return res.json(users);
  }
  res.status(401);
  throw new Error("No users found");
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("That user does not exist");
  }
  const deleteUser = await user.remove();

  if (!deleteUser) {
    res.status(400);
    throw new Error("Unable to process delete request");
  }

  res.json({
    message: "User was successfully deleted",
  });
});

module.exports = {
  getAllUsers,
  deleteUser,
};
