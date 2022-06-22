const { ObjectId } = require("mongodb");
const { ROLES } = require("../config/roles");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ForRegistration = require("../models/forRegistrationQueueModel");
const RegisteredTag = require("../models/registeredTagModel");
const RFIDDevice = require("../models/rfidDeviceModel");
const ScanLog = require("../models/scanLogModel");
const UnverifiedAcc = require("../models/unverifiedAccModel");
const { notifTypes } = require("../config/notifTypes");
const { createNotif } = require("./notificationController");
const Guest = require("../models/guestModel");
const ScanPoint = require("../models/scanPointModel");
const mailer = require("./mail");

// @desc    Get all users
// @route   GET /api/admin/users/
// @access  Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find(
    {},
    "fname lname email residence phone_number"
  ).lean();
  if (!users) {
    res.status(404);
    throw new Error("No users found");
  } else res.json(users);
});

// @desc    Get user with guests
// @route   GET /api/admin/user/:id
// @access  Private
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(
    req.params.id,
    "-password -notifications -qr"
  ).lean();
  const userGuests = await Guest.find({ u_id: user._id }).lean();
  if (!user || !userGuests) {
    res.status(404);
    throw new Error("No user found");
  } else res.status(200).json({ ...user, guests: userGuests });
});

// @desc    Get all users
// @route   PUT /api/admin/users/filter?
// @access  Private
const filterUsers = asyncHandler(async (req, res) => {
  User.paginate(
    parseInt(req.query.page),
    parseInt(req.query.limit),
    req.body,
    // req.query.role ? { role: ROLES[req.query.role] } : null,
    function (err, docs) {
      if (err) {
        res.status(404);
        throw new Error(err);
      } else res.json(docs);
    }
  );
});

// @desc    Get user by role
// @route   GET /api/admin/users/:role
// @access  Private
const getUsersByRole = asyncHandler(async (req, res) => {
  const users = await User.find(
    { role: ROLES[req.params.role] },
    "fname lname"
  ).lean();

  if (!users) {
    res.status(404);
    throw new Error("No users found");
  } else res.json(users);
});

// @desc    Delete account
// @route   DELETE /api/admin/users/:id
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

// @desc    Get all users
// @route   GET /api/admin/unverified
// @access  Private
const getAllUnverfied = asyncHandler(async (req, res) => {
  const accounts = await UnverifiedAcc.find({}).lean();
  if (!accounts) {
    res.status(404);
    throw new Error("No accounts found");
  } else res.json(accounts);
});

// @desc    set role and verify
// @route   PUT /api/admin/verify/:id
// @access  Private
const verifyUser = asyncHandler(async (req, res) => {
  const account = await UnverifiedAcc.findByIdAndUpdate(
    req.params.id,
    {
      role: req.body.role,
      verified: true,
    },
    { new: true }
  );

  if (!account || account.message) {
    res.status(400);
    throw new Error(unverified.message || "Uknown Error");
  }

  const mailOptions = {
    from: '"Community thesis app" <community4704@outlook.com>', // sender address
    to: account.email, // list of receivers
    subject: "Account confirmation", // Subject line
    html: `<div> <b>Your account has been verified please click the button below to create your password</b> <button><a href=http://localhost:3000/verification/${account.id} rel='external' target='_blank'>Create password</a></button> </div>`, // html body
  };
  await mailer.outlookTransporter
    .sendMail(mailOptions)
    .then((stat) => {
      if (stat.accepted.length > 0)
        res.json({ account, message: "Email sent via outlook" });
    })
    .catch(() => {
      mailOptions.from = '"Community thesis app" <community4704@gmail.com>';
      mailer.gmailTransporter
        .sendMail(mailOptions)
        .then((stat) => {
          if (stat.accepted.length > 0)
            res.json({ account, message: "Email sent via gmail" });
        })
        .catch(() => {
          res.status(400);
          throw new Error("Email not sent");
        });
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
  const inQueue = await ForRegistration.findOne({ user: user }).lean();

  if (!inQueue) {
    const addedToQueue = await ForRegistration.create({ user });
    res.status(201).json({ message: "Added to queue", id: addedToQueue.id });
  } else {
    res.json({ message: "Already in queue", id: inQueue.id });
  }
});

// @desc    From reader updates queue item with info from card if already registered otherwise proceed to ask name
// @route   GET /api/admin/rfid/register/:tag_uid
// @access  Private
const verifyTagStatus = asyncHandler(async (req, res) => {
  const firstInQueue = await ForRegistration.find()
    .sort({ $natural: 1 })
    .limit(1)
    .lean();

  // res.json(firstInQueue[0]);

  if (firstInQueue.length === 0) {
    res.status(404);
    throw new Error("No item in queue");
  }
  const isRegistered = await RegisteredTag.findOne({ uid: req.params.tag_uid })
    .lean()
    .populate("u_id", "fname lname")
    .populate("g_id", "fname lname");

  await ForRegistration.findByIdAndUpdate(
    firstInQueue[0]._id,
    isRegistered
      ? { registered_tag: isRegistered }
      : { tag_uid: req.params.tag_uid, continue: true }
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
  const inQueue = await ForRegistration.findById(req.params.queue_id)
    .lean()
    .populate("registered_tag");
  if (!inQueue) {
    res.status(404);
    throw new Error("Not in queue");
  }
  if (inQueue.registered_tag && !inQueue.continue) {
    const registered = await RegisteredTag.findById(inQueue.registered_tag)
      .lean()
      .populate("u_id", "fname lname")
      .populate("g_id", "fname lname");

    const name = registered.g_id
      ? registered.g_id.fname + " " + registered.g_id.lname
      : registered.u_id.fname + " " + registered.u_id.lname;

    res.status(201).json({
      message: "Already registered",
      queue_id: inQueue._id,
      name: name,
      tag_user_id: registered.g_id
        ? inQueue.registered_tag.g_id
        : inQueue.registered_tag.u_id,
    });
    return;
  }
  if (inQueue.continue) {
    res.status(201).json({
      message: "Register user to tag",
      queue_id: inQueue._id,
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
    inQueue.tag_uid = null;
    inQueue.save();
    res.json(inQueue);
  }
});

// @desc    Register card by passing tag user's name
// @route   POST /api/admin/rfid/register/q/:queue_id
// @access  Private
const tagRegistration = asyncHandler(async (req, res) => {
  const inQueue = await ForRegistration.findById(req.params.queue_id)
    .lean()
    .populate("registered_tag");

  if (!inQueue || inQueue.message) {
    res.status(404);
    throw new Error("Not in queue");
  }

  const tag_uid = inQueue.registered_tag
    ? inQueue.registered_tag.uid
    : inQueue.tag_uid;

  if (!req.body.g_id) {
    const tag = await RegisteredTag.findOneAndUpdate(
      { uid: tag_uid },
      { uid: tag_uid, u_id: inQueue.user },
      { upsert: true, new: true }
    ).lean();
    if (inQueue.registered_tag) {
      await Guest.findByIdAndUpdate(inQueue.registered_tag._id, {
        rf: null,
      }).lean();
    }
    await ForRegistration.deleteOne({ _id: req.params.queue_id });

    res.json({ message: "User tag registered", tag: tag });
  } else {
    const guest = await Guest.findByIdAndUpdate(
      req.body.g_id,
      {
        u_id: inQueue.user,
        /*   fname: req.body.fname,
        lname: req.body.lname,
        contact: req.body.phone_number,
        addr: req.body.address, */
        active: true,
      },
      { new: true }
    );

    const tag = await RegisteredTag.findOneAndUpdate(
      { uid: tag_uid },
      {
        uid: tag_uid,
        u_id: inQueue.user,
        g_id: guest.id,
      },
      { upsert: true, new: true }
    ).lean();

    guest.rf = tag.id;
    guest.save();

    await ForRegistration.deleteOne({ _id: req.params.queue_id });

    res.json({
      message: "Guest has been updated! rfid tag registered",
      tag: tag,
    });
  }
});

// @desc    Remove from queue, cancel registration
// @route   DELETE /api/admin/rfid/register/q/:queue_id
// @access  Private
const removeFromQueue = asyncHandler(async (req, res) => {
  const inQueue = await ForRegistration.findByIdAndDelete(
    req.params.queue_id
  ).lean();

  if (!inQueue) {
    res.status(400);
    throw new Error("Remove failed");
  } else res.sendStatus(200);
});

// @desc    Add locations
// @route   GET /api/admin/locations
// @access  Private
const getScanPoints = asyncHandler(async (req, res) => {
  const locations = await ScanPoint.find().lean();

  res.status(200).json(locations);
});
// @desc    Add a location
// @route   POST /api/admin/locations
// @access  Private
const addScanPoint = asyncHandler(async (req, res) => {
  const location = await ScanPoint.findOne({ label: req.body.label }).lean();
  if (location) {
    res.status(400);
    throw new Error("Location exists");
  }
  const newScanPoint = await ScanPoint.create({ label: req.body.label }).lean();

  if (!newScanPoint) {
    res.status(400);
    throw new Error("Add failed");
  } else {
    res.status(201).json(newScanPoint);
  }
});
// @desc    Get guests
// @route   GET /api/admin/guests?
// @access  Private
const filterGuests = asyncHandler(async (req, res) => {
  const guests = await Guest.find(req.query, "-updatedAt").lean();
  res.json(guests);
});
// @desc    Get devices
// @route   GET /api/admin/rfid/devices
// @access  Private
const getRFIDDevices = asyncHandler(async (req, res) => {
  const devices = await RFIDDevice.find().lean();
  res.json(devices);
});
// @desc    Register an rfid device
// @route   POST /api/admin/rfid/devices
// @access  Private
const registerRFIDDevice = asyncHandler(async (req, res) => {
  const device = await RFIDDevice.findOne({ device_key: req.body.key }).lean();
  if (device) {
    res.status(400);
    throw new Error("Key already taken please use another key");
  }
  const newDevice = await RFIDDevice.create({
    device_label: req.body.label,
    device_key: req.body.key,
    scan_point: req.body.locID || null,
    user: req.body.userID || null,
  });

  if (!newDevice) {
    res.status(400);
    throw new Error("Registration failed");
  } else {
    res.status(201).json(newDevice);
  }
});
// @desc    Register an rfid device
// @route   PUT /api/admin/rfid/devices
// @access  Private
const updateRFIDDevice = asyncHandler(async (req, res) => {
  const device = await RFIDDevice.findOneAndUpdate(
    { device_key: req.body.key },
    req.body,
    { new: true }
  ).lean();
  if (!device) {
    res.status(400);
    throw new Error("Update failed");
  } else {
    res.sendStatus(200);
  }
});

// @desc    Request from reader with tag uid as param
// @route   GET /api/admin/rfid/scan/:key/:id
// @access  Private
const checkRFIDTag = asyncHandler(async (req, res) => {
  const tag = await RegisteredTag.findOne({ uid: req.params.id })
    .lean()
    .populate("g_id", "fname");
  const scanner = await RFIDDevice.findOne({
    device_key: req.params.key,
  })
    .lean()
    .populate("scan_point", "label");

  if (!tag || !scanner) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  const logObj = {
    type: "rf",
    by: scanner.user,
    node: scanner.id,
    loc: scanner.scan_point,
    u_id: tag.u_id,
    //  g_id: !tag.g_id ?  : null,
  };
  if (tag.g_id) {
    logObj.g_id = tag.g_id;
  }

  const log = await ScanLog.create(logObj);

  const notify = await createNotif(
    {
      title: "RFID Tag scanned",
      category: notifTypes.entry_tag,
      text: !tag.g_id
        ? "Your card has been scanned! at " + scanner.scan_point.label
        : tag.g_id.fname + " has arrived at " + scanner.scan_point.label,
    },
    { id: tag.u_id }
  );

  if (!log || !notify) {
    res.status(400);
    throw new Error("Not recorded");
  } else {
    //console.log(req.params.id);
    res.sendStatus(200);
  }
});

// @desc    Get filter options
// @route   GET /api/admin/scans
// @access  Private
const getScanLogsFilters = asyncHandler(async (req, res) => {
  const allowed = await User.find(
    { role: { $in: [ROLES.ADMIN, ROLES.EDITOR] } },
    "_id fname lname"
  ).lean();

  if (!allowed) {
    res.status(404);
    throw new Error("No admins found");
  }

  const users = allowed.map((user) => {
    return { _id: user._id, label: user.fname + " " + user.lname };
  });

  const devices = await RFIDDevice.find({}, "id device_label").lean();

  if (!devices) {
    res.status(404);
    throw new Error("No devices found");
  }

  res.json({ users, devices });
});

// @desc    Filter scan logs
// @route   PUT /api/admin/scans?
// @access  Private
const filterScanLogs = asyncHandler(async (req, res) => {
  return ScanLog.paginate(
    parseInt(req.query.page),
    parseInt(req.query.limit),
    req.body.filter,
    function (err, docs) {
      if (err) {
        res.status(404);
        throw new Error(err);
      } else res.json(docs);
    }
  );
});

// @desc    Filter guest and user by name
// @route   PUT /api/admin/name/match?
// @access  Private
const findByName = asyncHandler(async (req, res) => {
  const fname = new RegExp(req.query.fname, "i");
  const lname = new RegExp(req.query.lname, "i");
  const users = await User.find(
    {
      fname: fname,
      lname: lname,
    },
    "-password -createdAt -updatedAt -notificaions"
  )
    .lean()
    .limit(10);

  const guests = await Guest.find(
    {
      fname: fname,
      lname: lname,
    },
    "-createdAt -updatedAt"
  )
    .lean()
    .limit(10);
  const docs = [...users, ...guests];
  res.json(docs);
});

module.exports = {
  getAllUsers,
  getUser,
  filterGuests,
  filterUsers,
  getUsersByRole,
  deleteUser,
  getAllUnverfied,
  verifyUser,
  queueUserTagRegistration,
  verifyTagStatus,
  tagRegistration,
  updateQueueItem,
  checkRegistrationStatus,
  removeFromQueue,
  getScanPoints,
  addScanPoint,
  getRFIDDevices,
  registerRFIDDevice,
  updateRFIDDevice,
  checkRFIDTag,
  findByName,
  filterScanLogs,
  getScanLogsFilters,
};
