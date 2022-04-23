const { ObjectId } = require("mongodb");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const ForRegistration = require("../models/forRegistrationQueueModel");
const RegisteredTag = require("../models/registeredTagModel");

// @desc    Get a QR hash for guest
// @route   GET /api/users/:id/:guest_id
// @access  Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  if (users) {
    return res.json(users);
  }
  res.status(404);
  throw new Error("No users found");
});

// @desc    Delete account
// @route   DELETE /api/users/:id
// @access  Private
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

// @desc    First declare an account and create a queue item for registration
// @route   POST /api/admin/rfid/register
// @access  Private
const queueUserTagRegistration = asyncHandler(async (req, res) => {
  if (!req.body.user) {
    res.status(400);
    throw new Error("Invalid request");
  }
  const user = ObjectId(req.body.user);
  const inQueue = await ForRegistration.findOne({ user: user });

  if (!inQueue) {
    const addedToQueue = await ForRegistration.create({ user });
    res.status(201).json({ message: "Added to queue", id: addedToQueue.id });
  } else {
    res.json({ message: "Already in queue", id: inQueue.id });
  }
});

// @desc    From reader updates queue item with info from card if already registered otherwise proceed to ask name
// @route   GET /api/admin/rfid/register/:tag_id
// @access  Private
const verifyTagStatus = asyncHandler(async (req, res) => {
  const firstInQueue = await ForRegistration.find()
    .sort({ $natural: 1 })
    .limit(1);

  // res.json(firstInQueue[0]);

  if (firstInQueue.length === 0) {
    res.status(404);
    throw new Error("No item in queue");
  }
  const isRegistered = await RegisteredTag.findOne({ uid: req.params.tag_id });

  await ForRegistration.findByIdAndUpdate(
    firstInQueue[0].id,
    isRegistered
      ? { registered_tag: isRegistered.id }
      : { available_tag: req.params.tag_id, continue: true }
  );
  res.sendStatus(isRegistered ? 202 : 200);
});

// @desc    Repeatedly called by site client once in queue
// @route   GET /api/admin/rfid/register/q/:queue_id
// @access  Private
const checkRegistrationStatus = asyncHandler(async (req, res) => {
  if (!req.params.queue_id) {
    res.status(400);
    throw new Error("Invalid request");
  }
  const inQueue = await ForRegistration.findById(req.params.queue_id).populate(
    "registered_tag"
  );
  if (!inQueue) {
    res.status(404);
    throw new Error("Not in queue");
  }
  if (!inQueue.registered_tag && !inQueue.continue) {
    res.status(201).json({
      message: "Already registered",
      tag: inQueue.registered_tag,
      queue_id: inQueue.id,
    });
    return;
  }
  if (inQueue.continue) {
    res.status(201).json({
      message: "Register user to tag",
      queue_id: inQueue.id,
      available_tag: inQueue.available_tag,
    });
  } else {
    res.status(200).json({ message: "Waiting" });
  }
});

// @desc    Update to continue or cancel registration
// @route   PUT /api/admin/rfid/register/q/:queue_id
// @access  Private
const updateQueueItem = asyncHandler(async (req, res) => {
  if (!req.params.queue_id || req.body.continue === undefined) {
    res.status(400);
    throw new Error("Invalid request");
  }
  const inQueue = await ForRegistration.findById(req.params.queue_id);

  if (!inQueue) {
    res.status(404);
    throw new Error("Not in queue");
  }

  if (req.body.action === "cont") {
    inQueue.continue = true;
    inQueue.save();
    res.json(inQueue);
  } else {
    inQueue.continue = false;
    inQueue.registered_tag = null;
    inQueue.available_tag = null;
    inQueue.save();
    res.json(inQueue);
  }
});

// @desc    Register card by passing tag user's name
// @route   POST /api/admin/rfid/register/q/:queue_id
// @access  Private
const tagRegistration = asyncHandler(async (req, res) => {
  const inQueue = await ForRegistration.findById(req.params.queue_id).populate(
    "user"
  );

  if (!inQueue || inQueue.message) {
    res.status(404);
    throw new Error("Not in queue");
  }

  const tag = await RegisteredTag.findOneAndUpdate(
    { uid: req.body.id },
    { uid: req.body.id, user: inQueue.user.id, used_by: req.body.name },
    { upsert: true, new: true }
  );

  await ForRegistration.deleteOne({ _id: req.params.queue_id });

  res.json({ message: "Tag registered", tag: tag });
});

// @desc    Remove from queue, cancel registration
// @route   DELETE /api/admin/rfid/register/q/:queue_id
// @access  Private
const removeFromQueue = asyncHandler(async (req, res) => {
  const inQueue = await ForRegistration.findByIdAndDelete(req.params.queue_id);

  if (!inQueue) {
    res.status(400);
    throw new Error("Remove failed");
  } else res.sendStatus(200);
});

module.exports = {
  getAllUsers,
  deleteUser,
  queueUserTagRegistration,
  verifyTagStatus,
  tagRegistration,
  updateQueueItem,
  checkRegistrationStatus,
  removeFromQueue,
};
