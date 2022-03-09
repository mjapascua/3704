const asyncHandler = require("express-async-handler");
const md5 = require("crypto-js/md5");

const User = require("../models/userModel");
const GuestAccessString = require("../models/accessStringsModel");
const TempLink = require("../models/tempLinkModel");
const phoneRegex = /^([0-9]{10})$/;

const requestGuestQR = asyncHandler(async (req, res) => {
  const { first_name, last_name, phone_number, address } = req.body;
  const hash = generateMd5Hash(req.user.id + first_name + last_name);
  if (!first_name || !last_name || !phone_number || !address) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  if (!phoneRegex.test(phone_number) || !phone_number.startsWith("9")) {
    res.status(400);
    throw new Error("Invalid phone number");
  }

  const hashExists = await GuestAccessString.findOne({ hash: hash });
  if (hashExists) {
    res.status(200).json({ hash: hash, exists: true });
  } else {
    const guestAccess = await GuestAccessString.create({
      hash,
      patron: req.user.id,
    });

    if (!guestAccess) {
      res.status(400);
      throw new Error("QR registration failed");
    }

    const update = await User.findByIdAndUpdate(req.user.id, {
      $push: {
        guests: {
          first_name: first_name,
          last_name: last_name,
          phone_number: phone_number,
          address: address,
          accessString_id: guestAccess._id,
        },
      },
    });

    if (!update) {
      res.status(400);
      throw new Error("Guest entry failed");
    }
    res.status(201).json({ hash: hash });
  }
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

const generateMd5Hash = (string) => {
  let hashed = md5(string).toString();
  let splitHash =
    hashed.slice(0, 4) +
    "-" +
    hashed.slice(4, 10) +
    "-" +
    hashed.slice(10, 20) +
    "-" +
    hashed.slice(20);

  return splitHash;
};

const validateLink = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(401);
  }

  const active = TempLink.find({ unique: req.params.uniq });

  if (!active) {
    res.status(404);
    throw new Error(
      "This link is unavailable! It may have expired or does not exist."
    );
  }

  req.user = user;
  next();
});

module.exports = {
  requestGuestQR,
  checkQR,
  generateMd5Hash,
  validateLink,
};
