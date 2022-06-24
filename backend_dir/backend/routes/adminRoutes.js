const express = require("express");
const router = express.Router();
const { ROLES } = require("../config/roles");
const {
  deleteUser,
  filterGuests,
  getUser,
  filterUsers,
  getAllUnverfied,
  verifyUser,
  getUsersByRole,
  queueUserTagRegistration,
  verifyTagStatus,
  tagRegistration,
  updateQueueItem,
  checkRegistrationStatus,
  removeFromQueue,
  getScanPoints,
  addScanPoint,
  updateScanPoint,
  delScanPoint,
  getRFIDDevices,
  registerRFIDDevice,
  updateRFIDDevice,
  delRFIDDevice,
  checkRFIDTag,
  filterScanLogs,
  findByName,
  getScanLogsFilters,
} = require("../controllers/adminRequestsController");
const { checkQR } = require("../controllers/qrController");
const { protect, authAllow } = require("../middleware/authMiddleware");

router.get("/rfid/scan/:key/:id", checkRFIDTag);
router.post("/rfid/register", queueUserTagRegistration);

router.get(
  "/users",
  filterUsers,
  protect,
  authAllow([ROLES.ADMIN, ROLES.EDITOR])
);
router.get("/name/match", findByName);
router.route("/scans").get(getScanLogsFilters).put(filterScanLogs);
router.get("/unverified", protect, getAllUnverfied);
router.put("/verify/:id", protect, verifyUser);
router.route("/guests").put(filterGuests);

router
  .route("/locations")
  .get(protect, getScanPoints)
  .post(protect, addScanPoint);
router
  .route("/locations/:id")
  .put(protect, updateScanPoint)
  .delete(protect, delScanPoint);

router
  .route("/rfid/devices")
  .get(protect, getRFIDDevices)
  .post(protect, registerRFIDDevice);
router
  .route("/rfid/devices/:id")
  .put(protect, updateRFIDDevice)
  .delete(protect, delRFIDDevice);

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

/* router.get(
  "/users",
  protect,
  authAllow([ROLES.ADMIN, ROLES.EDITOR]),
  getAllUsers
); */
module.exports = router;
