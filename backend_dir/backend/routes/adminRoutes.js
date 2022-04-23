const express = require("express");
const router = express.Router();
const { ROLES } = require("../config/roles");
const {
  deleteUser,
  getAllUsers,
  queueUserTagRegistration,
  verifyTagStatus,
  tagRegistration,
  updateQueueItem,
  checkRegistrationStatus,
  removeFromQueue,
} = require("../controllers/adminRequestsController");
const { checkQR } = require("../controllers/qrController");
const { protect, authAllow } = require("../middleware/authMiddleware");

router.get("/rfid/scan", (req, res) => {
  res.send("You are connected to the server!");
});
router.post("/rfid/register", queueUserTagRegistration);

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
router.delete("/users/:id", protect, authAllow([ROLES.ADMIN]), deleteUser);
module.exports = router;
