const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const TempLink = require("../models/tempLinkModel");
const GuestAccessString = require("../models/accessStringsModel");
const { generateMd5Hash } = require("./qrController");
const Guest = require("../models/guestModel");
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

  if (user.message || !user) {
    res.status(400);
    throw new Error(user.message || "Invalid data");
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

  res.json({
    id: _id,
    residence,
    first_name,
    last_name,
    email,
    phone_number,
    guests,
  });
});

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

  const string = await GuestAccessString.findOneAndDelete({ used_by: gId });

  if (!user) {
    res.status(401);
    throw new Error("Unauthorized user not found");
  }
  if (!string || !guest) {
    res.status(400);
    throw new Error("Access not removed");
  }

  res.json("success");
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

/* const requestQRFormLink2 = asyncHandler(async (req, res) => {
  let formToken;
  if(!req.user.visitor_form_link){
    formToken = jwt.sign(req.user.id, "VISITOR_ONLY_FORM", {
      expiresIn: "6h",
    });
    const user = User.findByIdAndUpdate()
  } else formToken = req.user.visitor_form_link;

  res.json({
    link: "http://localhost:3000/visitor_form/" + formToken,
  });
});
 */
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
  registerUser,
  loginUser,
  getMe,
  deleteGuests,
  requestQRFormLink,
};
