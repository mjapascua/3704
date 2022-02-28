const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const md5 = require("crypto-js/md5");
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
    res.status(201).json({
      _id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      token: generateToken(user._id),
    });
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

    res.json({
      _id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      token: token,
    });
  } else {
    res.status(400);
    throw new Error("Provided information does not match our records");
  }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const { _id, first_name, last_name, email } = await User.findById(
    req.user.id
  );

  res.status(200).json({
    id: _id,
    first_name,
    last_name,
    email,
  });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const options = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

const generateQRPass = (id, addString) => {
  const currDate = new Date();
  const dateString = currDate
    .toLocaleDateString("en-US", options)
    .replace(/[^0-9]/g, "");

  const hashed = md5(id + addString + dateString);
  userModel.findByIdAndUpdate(
    id,
    { $push: { accessStrings: hashed } },
    { new: true, upsert: true },
    function (err, raw) {
      if (err) throw new Error(err);
      else {
        res.json(raw);
        res.status(200);
      }
    }
  );
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
