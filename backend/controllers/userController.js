const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const Guest = require("../models/guestModel");
const TempLink = require("../models/tempLinkModel");
const AccessString = require("../models/accessStringsModel");
const UnverifiedAcc = require("../models/unverifiedAccModel");

const { generateMd5Hash } = require("./qrController");
const RegisteredTag = require("../models/registeredTagModel");
const mailer = require("./mail");

// @desc    Register new account
// @route   POST /api/users
// @access  Public
const regForVerification = asyncHandler(async (req, res) => {
  const { fname, lname, email, contact, residence } = req.body;
  if (!fname || !lname || !email || !contact || !residence) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  const userExists = await User.findOne({ email }).lean();
  const inVerification = await UnverifiedAcc.findOne({ email }).lean();

  if (userExists || inVerification) {
    res.status(400);
    throw new Error("Email is already taken");
  }

  const unverified = await UnverifiedAcc.create({
    fname,
    lname,
    email,
    contact,
    residence,
  });

  if (unverified.message || !unverified) {
    res.status(400);
    throw new Error(unverified.message || "Invalid data");
  } else {
    res.sendStatus(201);
  }
});

// @desc    Get unverified details
// @route   GET /api/users/verify/:id
// @access  Public
const unverifiedDetails = asyncHandler(async (req, res) => {
  const details = await UnverifiedAcc.findById(
    req.params.id,
    "-id -createdAt -residence -contact"
  ).lean();
  res.json(details);
});

// @desc    Complete account activation
// @route   POST /api/users/verify/:id
// @access  Public
const confirmViaEmail = asyncHandler(async (req, res) => {
  const account = await UnverifiedAcc.findById(req.params.id);
  const { fname, lname, email, contact, residence, role } = account;
  const password = req.body.password;
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const main_unique = generateMd5Hash(fname + email + residence);

  // Create qr hash
  const access = await AccessString.create({
    hash: main_unique,
    resident: true,
  });
  // Create user
  const user = await User.create({
    fname,
    lname,
    role,
    email,
    contact,
    residence,
    qr: access._id,
    password: hashedPassword,
  });

  await UnverifiedAcc.findByIdAndDelete(req.params.id);

  access.u_id = user._id;
  access.save();

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
  const user = await User.findOne({ email }).lean();

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
  const { _id, fname, lname, email, residence, contact } = await User.findById(
    req.user.id
  ).lean();
  const guests = await Guest.find({ u_id: req.user.id, active: true });
  const tags = await RegisteredTag.find({ u_id: req.user.id }).populate("g_id");

  if (!_id) {
    res.status(404);
    throw new Error("Not found");
  }

  res.json({
    id: _id,
    residence,
    fname,
    lname,
    email,
    contact,
    guests,
    tags,
  });
});

// @desc    Set guest to inactive
// @route   DELETE /api/users/:id/:guest_id
// @access  Private
const deleteGuests = asyncHandler(async (req, res) => {
  if (!req.params.guest_id) {
    res.status(400);
    throw new Error("Unable to process");
  }
  await AccessString.findOneAndDelete({
    g_id: req.params.guest_id,
  });

  const guest = await Guest.findByIdAndUpdate(
    req.params.guest_id,
    {
      active: false,
      qr: null,
      last_disabled: new Date(),
    },
    { new: true }
  );

  /*   if (!user) {
    res.status(401);
    throw new Error("Unauthorized user not found");
  } */
  if (!guest) {
    res.status(400);
    throw new Error("Access not removed");
  } else res.json("success");
});

// @desc    Update user data
// @route   PUT /api/users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const userToUpdate = await User.findByIdAndUpdate(
    req.params.id,
    req.body
  ).lean();
  if (!userToUpdate) {
    res.status(404);
    throw new Error("Unable to find and update the user");
  } else return res.json({ fname: userToUpdate.fname });
});

// @desc    Update user data
// @route   PUT /api/users/:uniq/:id
// @access  Private
const userToChange = asyncHandler(async (req, res) => {
  const userToUpdate = await User.findById(req.params.id, "fname email").lean();
  if (!userToUpdate) {
    res.status(404);
    throw new Error("No user found");
  } else {
    res.json({ fname: userToUpdate.fname, email: userToUpdate.email });
  }
});
// @desc    Update user password
// @route   POST /api/users/newpass
// @access  Private
const requestNewUserPass = asyncHandler(async (req, res) => {
  const userToUpdate = await User.findOne({ email: req.body.email }).lean();
  if (!userToUpdate) {
    res.status(404);
    throw new Error("No matching email found");
  }
  const linkUniq = generateRandomString("10");
  const uniq = await TempLink.create({
    unique: linkUniq,
    user: userToUpdate._id,
  });
  if (!uniq) {
    res.status(404);
    throw new Error("Password change failed");
  }

  const link = `https://${req.get("host")}/password_update/${linkUniq}/${
    userToUpdate._id
  }`;
  //const link = `http://localhost:3000/password_update/${linkUniq}/${userToUpdate._id}`;
  const mailOptions = {
    from: '"Community thesis app" <community4704@outlook.com>', // sender address
    to: req.body.email, // list of receivers
    subject: "Password change", // Subject line
    html: `<div> <b>Your account has requested a change of password click on the button to proceed. If this is not you, you can ignore this message.</b> <button><a href=${link} rel='external' target='_blank'>Create password</a></button> </div>`, // html body
  };
  try {
    await mailer.outlookTransporter
      .sendMail(mailOptions)
      .then((stat) => {
        if (stat.accepted.length > 0) {
          res.status(201).json({ message: "Email confirmation sent" });
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        mailOptions.from = '"Community thesis app" <community4704@gmail.com>';
        mailer.gmailTransporter.sendMail(mailOptions).then((stat) => {
          if (stat.accepted.length > 0) {
            res.status(201).json({ message: "Email confirmation sent" });
          } else {
            throw new Error();
          }
        });
      });
  } catch (error) {
    res.status(400);
    throw new Error("Email not sent");
  }
});

// @desc    Update user password
// @route   PUT /api/users/newpass/:uniq/:id
// @access  Private
const updateUserPass = asyncHandler(async (req, res) => {
  const active = await TempLink.findOne({ unique: req.params.uniq }).lean();
  if (!active) {
    res.status(404);
    throw new Error(
      "This link is unavailable! It may have expired or does not exist."
    );
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const userToUpdate = await User.findByIdAndUpdate(
    req.params.id,
    { password: hashedPassword },
    { new: true }
  ).lean();

  if (!userToUpdate) {
    res.status(404);
    throw new Error("Password change failed");
  } else return res.sendStatus(200);
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

  let host =
    process.env.NODE_ENV === "production"
      ? "https://hoasys.herokuapp.com/"
      : "http://localhost:3000/";

  res.json({
    link: host + "visitor_form/" + user.id + "_" + unique,
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
  regForVerification,
  unverifiedDetails,
  updateUser,
  updateUserPass,
  requestNewUserPass,
  confirmViaEmail,
  loginUser,
  getMe,
  deleteGuests,
  requestQRFormLink,
  userToChange,
};
