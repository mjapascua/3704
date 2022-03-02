const asyncHandler = require("express-async-handler");
const md5 = require("crypto-js/md5");

const User = require("../models/userModel");
const GuestAccessString = require("../models/accessStringsModel");
const phoneRegex = /^([0-9]{10})$/;

const requestGuestQR = asyncHandler(async (req, res) => {
  const { first_name, last_name, phone_number, address } = req.body;
  const hash = generateQRString(req.user.id, first_name + last_name);
  if (!first_name || !last_name || !phone_number || !address) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  if (!phoneRegex.test(phone_number) || !phone_number.startsWith("9")) {
    res.status(400);
    throw new Error("Invalid phone number");
  }

  const hashExists = GuestAccessString.findOne({ hash: hash });
  if (hashExists) {
    res.status(200).json({ hash: hash });
  }

  const guestAccess = await GuestAccessString.create({
    hash,
    patron_id: req.user.id,
  });

  if (!guestAccess) {
    res.status(400);
    throw new Error("QR registration failed");
  }

  const update = await User.findByIdAndUpdate(req.user.id, {
    $push: {
      guests: { ...req.body, accessString_id: guestAccess._id },
    },
  });

  if (!update) {
    res.status(400);
    throw new Error("Guest entry failed");
  }
  res.status(201).json({ hash: hash });
});

const checkQR = asyncHandler(async (req, res) => {
  const entry = await GuestAccessString.findOneAndUpdate(
    { hash: req.body.hash },
    {
      $push: {
        scanHistory: new Date(),
      },
    }
  );
  if (!entry) {
    res.status(400).json({
      message: "No entry",
    });
  }

  res.status(200).json({
    message: "Allow",
  });
});

const options = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

const generateQRString = (id, addString) => {
  const hashed = md5(id + addString).toString();
  return hashed;
};

module.exports = {
  requestGuestQR,
  checkQR,
};
