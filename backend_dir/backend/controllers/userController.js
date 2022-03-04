const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, phone_number, residence, password } =
    req.body;

  if (
    !first_name ||
    !last_name ||
    !email ||
    !phone_number ||
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

  // Create user
  const user = await User.create({
    first_name,
    last_name,
    email,
    phone_number,
    residence,
    password: hashedPassword,
  });

  if (user) {
    const token = generateToken(user._id);
    res.cookie("_token", token).status(201).json(token);
  } else {
    res.status(400);
    throw new Error("Invalid User Data");
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
    res.cookie("_token", token, remember && { maxAge: 30 * 24 * 3600 * 1000 });

    res.json(token);
  } else {
    res.status(400);
    throw new Error("Provided information does not match our records");
  }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, residence, phone_number, guests } =
    await User.findById(req.user.id);

  res.status(200).json({
    residence,
    first_name,
    last_name,
    email,
    phone_number,
    guests,
  });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
