const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  deleteGuests,
  requestQRFormLink,
} = require("../controllers/userController");
const { requestGuestQR } = require("../controllers/qrController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/request_share_link", protect, requestQRFormLink);
router.post("/guests/create-qr", protect, requestGuestQR);
router.delete("/:id/:guest_id", protect, deleteGuests);

module.exports = router;
