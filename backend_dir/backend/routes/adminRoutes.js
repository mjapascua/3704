const express = require("express");
const router = express.Router();
const { ROLES } = require("../config/roles");
const {
  deleteUser,
  getAllUsers,
  getUsersByRole,
  queueUserTagRegistration,
  verifyTagStatus,
  tagRegistration,
  updateQueueItem,
  checkRegistrationStatus,
  removeFromQueue,
  registerRFIDDevice,
  updateRFIDDevice,
  checkRFIDTag,
} = require("../controllers/adminRequestsController");
const { checkQR } = require("../controllers/qrController");
const { protect, authAllow } = require("../middleware/authMiddleware");

router.get("/rfid/scan/:key/:id", checkRFIDTag);
router.post("/rfid/register", queueUserTagRegistration);

router
  .route("/rfid/device")
  .post(protect, registerRFIDDevice)
  .put(protect, updateRFIDDevice);

router.get("/rfid/register/:tag_id", verifyTagStatus);

router.post("/scan", protect, authAllow([ROLES.ADMIN, ROLES.EDITOR]), checkQR);

router
  .route("/rfid/register/q/:queue_id")
  .get(checkRegistrationStatus)
  .post(tagRegistration)
  .put(updateQueueItem)
  .delete(removeFromQueue);

router.get(
  "/users",
  protect,
  authAllow([ROLES.ADMIN, ROLES.EDITOR]),
  getAllUsers
);

router.get("/users/:role", protect, authAllow([ROLES.ADMIN]), getUsersByRole);

router.delete("/users/:id", protect, authAllow([ROLES.ADMIN]), deleteUser);
module.exports = router;
