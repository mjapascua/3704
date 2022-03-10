const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  deleteGuests,
  requestQRFormLink,
  updateUser,
} = require("../controllers/userController");
const {
  requestGuestQR,
  guestQR,
  userQR,
} = require("../controllers/qrController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/:id/edit", protect, updateUser);
router.get("/me", protect, getMe);
router.get("/qr", protect, userQR);
router.get("/guest_qr/:id", protect, guestQR);
router.get("/request_share_link", protect, requestQRFormLink);
router.post("/guests/create-qr", protect, requestGuestQR);
router.delete("/:id/:guest_id", protect, deleteGuests);

module.exports = router;
