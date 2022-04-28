const express = require("express");
const router = express.Router();
const { ROLES } = require("../config/roles");
const {
  deleteUser,
  filterGuests,
  getUser,
  filterUsers,
  getAllUsers,
  getUsersByRole,
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
  filterScanLogs,
  getScanLogsFilters,
} = require("../controllers/adminRequestsController");
const { checkQR } = require("../controllers/qrController");
const { protect, authAllow } = require("../middleware/authMiddleware");

router.get("/rfid/scan/:key/:id", checkRFIDTag);
router.post("/rfid/register", queueUserTagRegistration);

router.get("/users/filter", filterUsers);
router.route("/scans").get(getScanLogsFilters).put(filterScanLogs);
router.route("/guests").put(filterGuests);

//router.route("/guests").get(protect, filterGuests);
router
  .route("/locations")
  .get(protect, getScanPoints)
  .post(protect, addScanPoint);

router
  .route("/rfid/devices")
  .get(protect, getRFIDDevices)
  .post(protect, registerRFIDDevice)
  .put(protect, updateRFIDDevice);

router.get("/rfid/register/:tag_uid", verifyTagStatus);

router.post("/scan", protect, authAllow([ROLES.ADMIN, ROLES.EDITOR]), checkQR);

router
  .route("/rfid/register/q/:queue_id")
  .get(checkRegistrationStatus)
  .post(tagRegistration)
  .put(updateQueueItem)
  .delete(removeFromQueue);

router.get("/users/:role", protect, authAllow([ROLES.ADMIN]), getUsersByRole);

router
  .route("/user/:id")
  .get(protect, getUser)
  .delete(protect, authAllow([ROLES.ADMIN]), deleteUser);

router.get(
  "/users",
  protect,
  authAllow([ROLES.ADMIN, ROLES.EDITOR]),
  getAllUsers
);
module.exports = router;
