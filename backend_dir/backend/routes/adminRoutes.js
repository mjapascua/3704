const express = require("express");
const router = express.Router();
const { ROLES } = require("../config/roles");
const {
  deleteUser,
  getAllUsers,
} = require("../controllers/adminRequestsController");
const { checkQR } = require("../controllers/qrController");
const { authAllow } = require("../controllers/roleController");
const { protect } = require("../middleware/authMiddleware");

router.get("/scan/rfid", (req, res) => {
  res.send("You are connected to the server!");
});
router.post("/scan", protect, authAllow([ROLES.ADMIN, ROLES.EDITOR]), checkQR);

router.get(
  "/users",
  protect,
  authAllow([ROLES.ADMIN, ROLES.EDITOR]),
  getAllUsers
);
router.delete(
  "/users/delete/:id",
  protect,
  authAllow([ROLES.ADMIN]),
  deleteUser
);
module.exports = router;
