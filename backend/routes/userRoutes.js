const express = require("express");
const router = express.Router();
const {
  regForVerification,
  unverifiedDetails,
  confirmViaEmail,
  loginUser,
  getMe,
  deleteGuests,
  requestQRFormLink,
  updateUser,
  requestNewUserPass,
  updateUserPass,
  userToChange,
} = require("../controllers/userController");
const {
  requestGuestQR,
  guestQR,
  userQR,
} = require("../controllers/qrController");
const { protect } = require("../middleware/authMiddleware");
const {
  getNotifs,
  readNotifs,
} = require("../controllers/notificationController");

router.post("/", regForVerification);
router.route("/verify/:id").get(unverifiedDetails).post(confirmViaEmail);
router.route("/newpass").post(requestNewUserPass);
router.route("/newpass/:uniq/:id").get(userToChange).put(updateUserPass);

router.post("/login", loginUser);

router.route("/:id").put(protect, updateUser);
router.get("/me", protect, getMe);

router.get("/notifs", protect, getNotifs);
router.get("/read_notifs", protect, readNotifs);
router.get("/qr", protect, userQR);

router.get("/guest_qr/:id", protect, guestQR);
router.get("/request_share_link", protect, requestQRFormLink);
router.post("/guests/create-qr", protect, requestGuestQR);
router.delete("/:id/:guest_id", protect, deleteGuests);

module.exports = router;
