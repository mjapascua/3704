const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/userController");
const { requestGuestQR, checkQR } = require("../controllers/qrController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.post("/guests/create-qr", protect, requestGuestQR);
router.post("/scan", protect, checkQR);

module.exports = router;
