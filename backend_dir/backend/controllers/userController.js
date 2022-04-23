const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const Guest = require("../models/guestModel");
const TempLink = require("../models/tempLinkModel");
const AccessString = require("../models/accessStringsModel");
const RegisteredTag = require("../models/registeredTagModel");

const { generateMd5Hash } = require("./qrController");
// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    residence,
    password,
    role,
  } = req.body;

  if (
    !first_name ||
    !last_name ||
    !email ||
    !phone_number ||
    !role ||
    !residence ||
    !password
  ) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email is already taken");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const main_unique = generateMd5Hash(first_name + email + residence);

  // Create user
  const user = await User.create({
    first_name,
    last_name,
    role,
    email,
    phone_number,
    residence,
    main_unique,
    password: hashedPassword,
  });

  const access = await AccessString.create({
    hash: main_unique,
    patron: user._id,
    used_by: null,
  });

  if (user.message || !user || !access || access.message) {
    res.status(400);
    throw new Error(user.message || access.message || "Invalid data");
  } else {
    const token = generateToken(user._id);
    res
      .cookie("_token", token)
      .cookie("_ar", user.role)
      .status(201)
      .json({ token: token, role: user.role });
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, remember } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user._id);

    // Set token as cookie on response
    res
      .cookie("_token", token, remember && { maxAge: 30 * 24 * 3600 * 1000 })
      .cookie("_ar", user.role, remember && { maxAge: 30 * 24 * 3600 * 1000 })
      .json({ token: token, role: user.role });
  } else {
    res.status(400);
    throw new Error("Provided information does not match our records");
  }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const { _id, first_name, last_name, email, residence, phone_number, guests } =
    await User.findById(req.user.id).populate("guests");
  const user_tags = await RegisteredTag.find({ patron: req.user.id });

  res.json({
    id: _id,
    residence,
    first_name,
    last_name,
    email,
    phone_number,
    user_tags,
    guests,
  });
});

// @desc    Set guest to inactive
// @route   GET /api/users/:id/:guest_id
// @access  Private
const deleteGuests = asyncHandler(async (req, res) => {
  if (!req.params.guest_id) {
    res.status(400);
    throw new Error("Unable to process");
  }
  const gId = mongoose.Types.ObjectId(req.params.guest_id);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $pull: {
        guests: gId,
      },
    },
    { new: true }
  );

  const guest = await Guest.findByIdAndUpdate(gId, {
    active: false,
    last_disabled: new Date(),
  });

  await AccessString.findOneAndDelete({ used_by: gId });

  if (!user) {
    res.status(401);
    throw new Error("Unauthorized user not found");
  }
  if (!guest) {
    res.status(400);
    throw new Error("Access not removed");
  }
  res.json("success");
});

// @desc    Update user data
// @route   PUT /api/users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const userToUpdate = await User.findByIdAndUpdate(req.params.id, req.body);
  if (!userToUpdate) {
    res.status(404);
    throw new Error("Unable to find and update the user");
  } else return res.json({ first_name: userToUpdate.first_name });
});

const requestQRFormLink = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate("visitor_form_link");

  if (!user) {
    res.status(404);
  }
  let unique;

  if (!user.visitor_form_link) {
    const tempLink = await TempLink.create({
      unique: generateRandomString(13),
      user: user.id,
    });

    user.visitor_form_link = tempLink.id;
    user.save();

    unique = tempLink.unique;
  } else unique = user.visitor_form_link.unique;

  res.json({
    link: "http://localhost:3000/visitor_form/" + user.id + "_" + unique,
  });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const generateRandomString = (len) => {
  let string = "";
  for (; string.length < len; ) {
    string += Math.random().toString(20).substring(2);
  }
  return string.slice(0, len);
};

module.exports = {
  updateUser,
  registerUser,
  loginUser,
  getMe,
  deleteGuests,
  requestQRFormLink,
};
