const { ObjectId } = require("mongodb");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ForRegistration = require("../models/forRegistrationQueueModel");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  if (users) {
    return res.json(users);
  }
  res.status(401);
  throw new Error("No users found");
});

const queueUserTagRegistration = asyncHandler(async (req, res) => {
  if (!req.body.id) {
    res.status(401);
    throw new Error("Invalid request");
  }
  const user = ObjectId(req.body.id);
  const inQueue = await ForRegistration.findOne({ user: user });

  if (!inQueue?.user) {
    ForRegistration.create({ user });
    res.status(201).json("Added to queue");
  } else {
    res.json("Already in queue");
  }
});

const tagRegistration = asyncHandler(async (req, res) => {
  const inQueue = await ForRegistration.findOne()
    .sort({ $natural: 1 })
    .limit(1)
    .populate("user");

  if (inQueue && inQueue.user) {
    const user = await User.findByIdAndUpdate(inQueue.user.id, {
      tag_uid: req.body?.uid,
    });
    if (!user?.message) {
      res.json({
        hash: inQueue.user.main_unique.split("-").join(""),
        queue_id: inQueue._id,
        name: inQueue.user.first_name + " " + inQueue.user.last_name,
      });
    }
  } else {
    res.status(401);
    throw new Error("No user found");
  }
});

const removeFromQueue = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(401);
    throw new Error("Invalid request");
  }
  const inQueue = await ForRegistration.findByIdAndDelete(req.params.id);

  if (!inQueue?.message) {
    res.json("Registration complete");
  } else {
    res.status(401);
    throw new Error("Remove from queue failed");
  }
});

const checkIfRegistered = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(401);
    throw new Error("Invalid request");
  }

  const user = await User.findById(req.params.id);

  if (!user.message && user) {
    if (user.tag_uid) {
      res.sendStatus(201);
    } else res.sendStatus(200);
  } else {
    res.status(401);
    throw new Error("User not found");
  }
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
  queueUserTagRegistration,
  tagRegistration,
  removeFromQueue,
  checkIfRegistered,
};
