const asyncHandler = require("express-async-handler");
const md5 = require("crypto-js/md5");
const qrCode = require("qrcode");

const User = require("../models/userModel");
const GuestAccessString = require("../models/accessStringsModel");
const TempLink = require("../models/tempLinkModel");
const Guest = require("../models/guestModel");
const phoneRegex = /^([0-9]{10})$/;
const qrOptions = { scale: 8 };

// @desc    Get a QR hash for guest
// @route   GET /api/users/:id/:guest_id
// @access  Private
const requestGuestQR = asyncHandler(async (req, res) => {
  const { first_name, last_name, phone_number, address } = req.body;
  if (!first_name || !last_name || !phone_number || !address) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  if (!phoneRegex.test(phone_number) || !phone_number.startsWith("9")) {
    res.status(400);
    throw new Error("Invalid phone number");
  }

  const guestExists = await Guest.findOne({
    first_name,
    last_name,
    phone_number,
    patron: req.user.id,
  }).populate("access_string");

  if (!guestExists) {
    const hash = generateMd5Hash(req.user.id + first_name + phone_number);
    const guest = await Guest.create({
      first_name,
      last_name,
      phone_number,
      address,
      patron: req.user.id,
    });

    const guestAccess = await GuestAccessString.create({
      hash,
      patron: req.user.id,
      used_by: guest.id,
    });

    if (!guest || !guestAccess) {
      res.status(400);
      throw new Error("Guest registration failed");
    }

    await Guest.findByIdAndUpdate(guest._id, {
      access_string: guestAccess.id,
    });

    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        guests: guest.id,
      },
    });

    try {
      const url = await qrCode.toDataURL(guestAccess.hash, qrOptions);
      return res.status(201).json({ url: url });
    } catch (error) {
      res.status(400);
      throw new Error("QR creation failed");
    }
  }

  if (guestExists.access_string) {
    try {
      const url = await qrCode.toDataURL(
        guestExists.access_string.hash,
        qrOptions
      );
      return res.json({ url: url, exists: "already active" });
    } catch (error) {
      res.status(400);
      throw new Error("QR creation failed");
    }
  }

  if (!guestExists.active) {
    const hash = generateMd5Hash(req.user.id + first_name + phone_number);
    const guestAccess = await GuestAccessString.create({
      hash,
      patron: req.user.id,
      used_by: guestExists.id,
    });
    const guestUpdate = await Guest.findByIdAndUpdate(guestExists.id, {
      active: true,
      access_string: guestAccess.id,
    });
    const update = await User.findByIdAndUpdate(req.user.id, {
      $push: {
        guests: guestExists.id,
      },
    });

    if (!guestUpdate || !update) {
      res.status(404);
      throw new Error("QR registration failed");
    }
    try {
      const url = await qrCode.toDataURL(guestAccess.hash, qrOptions);
      return res.status(201).json({ url: url, exists: "inactive" });
    } catch (error) {
      res.status(400);
      throw new Error("QR creation failed");
    }
  }
});

const userQR = asyncHandler(async (req, res) => {
  try {
    const url = await qrCode.toDataURL(req.user.main_unique, qrOptions);
    return res.json(url);
  } catch (error) {
    res.status(404);
    throw new Error("Not found!");
  }
});

const guestQR = asyncHandler(async (req, res) => {
  const access = await GuestAccessString.findById(req.params.id);
  try {
    const url = await qrCode.toDataURL(access.hash, qrOptions);
    return res.json(url);
  } catch (error) {
    res.status(404);
    throw new Error("Not found!");
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
  ).populate("used_by");

  if (!entry) {
    res.status(400).json({
      message: "No entry",
    });
  }

  res.status(200).json({
    message: "Allow",
    information: entry,
  });
});

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

  const active = await TempLink.findOne({ unique: req.params.uniq });

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
  userQR,
  guestQR,
};
