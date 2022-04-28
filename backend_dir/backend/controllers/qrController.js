const asyncHandler = require("express-async-handler");
const md5 = require("crypto-js/md5");
const qrCode = require("qrcode");

const User = require("../models/userModel");
const AccessString = require("../models/accessStringsModel");
const TempLink = require("../models/tempLinkModel");
const Guest = require("../models/guestModel");
const ScanLog = require("../models/scanLogModel");
const { notifTypes } = require("../config/notifTypes");
const { createNotif } = require("./notificationController");
const ScanPoint = require("../models/scanPointModel");
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
    fname: first_name,
    lname: last_name,
    contaact: phone_number,
    uid: req.user.id,
  }).populate("qr");

  if (!guestExists) {
    const hash = generateMd5Hash(req.user.id + first_name + phone_number);
    const guest = await Guest.create({
      fname: first_name,
      lname: last_name,
      contact: phone_number,
      addr: address,
      u_id: req.user.id,
    });

    const guestAccess = await AccessString.create({
      hash,
      u_id: req.user.id,
      g_id: guest.id,
    });

    if (!guest || !guestAccess) {
      res.status(400);
      throw new Error("Guest registration failed");
    }

    guest.qr = guestAccess.id;
    guest.save();
    /* 
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: {
          guests: guest.id,
        },
      },
      { new: true }
    );

    if (!user) {
      res.status(400);
      throw new Error("Guest registration failed");
    } */

    try {
      const url = await qrCode.toDataURL(guestAccess.hash, qrOptions);
      return res.status(201).json({ url: url });
    } catch (error) {
      res.status(400);
      throw new Error("QR creation failed");
    }
  }

  if (guestExists.qr) {
    try {
      const url = await qrCode.toDataURL(guestExists.qr.hash, qrOptions);
      return res.json({ url: url, exists: "already active" });
    } catch (error) {
      res.status(400);
      throw new Error("QR creation failed");
    }
  }

  if (!guestExists.active) {
    const hash = generateMd5Hash(req.user.id + first_name + phone_number);
    const guestAccess = await AccessString.create({
      hash,
      u_id: req.user.id,
      g_id: guestExists.id,
    });

    guestExists.active = true;
    guestExists.save();
    /* 
    const update = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: {
          guests: guestExists.id,
        },
      },
      { new: true }
    ); */

    if (!guestUpdate /* || !update */) {
      res.status(404);
      throw new Error("QR registration failed");
    }
    try {
      const url = await qrCode.toDataURL(guestAccess.hash, qrOptions);
      res.status(201).json({ url: url, exists: "inactive" });
    } catch (error) {
      res.status(400);
      throw new Error("QR creation failed");
    }
  }
});

const userQR = asyncHandler(async (req, res) => {
  try {
    const url = await qrCode.toDataURL(req.user.main_unique, qrOptions);
    res.json(url);
  } catch (error) {
    res.status(404);
    throw new Error("Not found!");
  }
});

const guestQR = asyncHandler(async (req, res) => {
  const access = await AccessString.findById(req.params.id);
  if (!access) {
    res.status(404);
    throw new Error("Not found!");
  }
  const url = await qrCode.toDataURL(access.hash, qrOptions);
  res.json(url);
});

const checkQR = asyncHandler(async (req, res) => {
  const entry = await AccessString.findOne({ hash: req.body.hash }).populate(
    "g_id",
    "fname"
  );

  if (!entry || entry.message) {
    res.status(401);
    throw new Error("No Entry");
  }

  const loc = await ScanPoint.findById(req.body.locID);

  const logObj = {
    type: "qr",
    by: req.user.id,
    loc: req.body.locID,
    u_id: entry.u_id,
  };

  if (entry.g_id) {
    logObj.g_id = entry.g_id;
  }

  const log = await ScanLog.create(logObj);

  if (!log) {
    res.status(400);
    throw new Error("Not recorded");
  }

  await createNotif(
    {
      title: "QR scanned",
      category: notifTypes.Entry_guest,
      text: !entry.g_id
        ? "Your QR has been scanned at " + loc.label
        : entry.g_id.fname + " has arrived! at " + loc.label,
    },
    { id: entry.u_id }
  );

  res.status(200).json({
    message: "Allow",
  });
});

const generateMd5Hash = (string) => {
  return md5(string).toString();
  /*   let splitHash =
    hashed.slice(0, 4) +
    "-" +
    hashed.slice(4, 10) +
    "-" +
    hashed.slice(10, 20) +
    "-" +
    hashed.slice(20); */

  //  return hashed;
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
