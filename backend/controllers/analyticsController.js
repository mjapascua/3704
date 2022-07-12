const asyncHandler = require("express-async-handler");
const ScanLog = require("../models/scanLogModel");
const ScanPoint = require("../models/scanPointModel");
const User = require("../models/userModel");
const RegisteredTag = require("../models/registeredTagModel");
const Guest = require("../models/guestModel");
const AccessString = require("../models/accessStringsModel");
const { ROLES } = require("../config/roles");

// @desc    Get all users
// @route   GET /api/admin/users/
// @access  Private
const getAnalytics = asyncHandler(async (req, res) => {
  let today = new Date();
  const byLocCount = [];

  const locations = await ScanPoint.find({ active: true }, "_id label").lean();
  const guestQrs = await AccessString.countDocuments({
    active: true,
    g_id: { $ne: null },
  }).lean();
  const resQrs = await AccessString.countDocuments({
    active: true,
    resident: true,
  }).lean();
  const residentCount = await User.countDocuments({ role: ROLES.BASIC }).lean();
  const guestCount = await Guest.countDocuments({ active: true }).lean();
  const tagCount = await RegisteredTag.countDocuments({}).lean();

  const thisWeek = await getPerDayScans(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6),
    today
  );
  const lastWeek = await getPerDayScans(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 13),
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
  );
  const last2Week = await getPerDayScans(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 20),
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14)
  );
  await Promise.all(
    locations.map(async (loc) => {
      const rf = await ScanLog.countDocuments({
        loc: loc._id,
        type: "rf",
      }).lean();
      const qr = await ScanLog.countDocuments({
        loc: loc._id,
        type: "qr",
      }).lean();
      byLocCount.push({ label: loc.label, rf, qr });
    })
  );
  const totalQR = await ScanLog.countDocuments({ type: "qr" }).lean();
  const totalRf = await ScanLog.countDocuments({ type: "rf" }).lean();

  if (
    locations.message ||
    residentCount.message ||
    guestCount.message ||
    totalQR.message ||
    totalRf.message ||
    tagCount.message
  ) {
    res.status(404);
    throw new Error("Count failed");
  }

  res.json({
    totalQR,
    totalRf,
    totalLogs: totalQR + totalRf,
    weekLogStat: { last2Week, lastWeek, thisWeek },
    byLocCount,
    residentCount,
    guestCount,
    tagCount,
    qrCount: {
      guests: guestQrs,
      residents: resQrs,
    },
  });
});

const getPerDayScans = async (start, end) => {
  const days = getDateBlocks(start, end);
  const data = [];
  await Promise.all(
    days.map(async (date) => {
      const ndata = await getDateData(date);
      data.push(ndata);
    })
  );
  return data.sort((a, b) => a.date - b.date);
};
const getDateData = async (date) => {
  return ScanLog.find({ createdAt: date })
    .populate("g_id")
    .then((doc) => {
      const resiCount = doc.filter((scan) => {
        return scan.g_id === null || scan.g_id === undefined || scan.g_id?.rf;
      }).length;

      /*  const label = date.$gte.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }); */
      const data = {
        //label,
        date: date.$gte,
        total: doc.length,
        rf: doc.filter((scan) => scan.type === "rf").length,
        qr: doc.filter((scan) => scan.type === "qr").length,
        resident: resiCount,
      };
      return data;
    });
};

function getDateBlocks(start, end) {
  let result = [];
  let curr = new Date(start);

  while (curr <= end) {
    let next = new Date(
      curr.getFullYear(),
      curr.getMonth(),
      curr.getDate() + 1
    );
    result.push({ $gte: curr, $lte: next });
    curr = next;
  }
  return result;
}
//getPerDayScans(new Date(2022, 6, 11), new Date(2022, 6, 11));

module.exports = {
  getAnalytics,
};
