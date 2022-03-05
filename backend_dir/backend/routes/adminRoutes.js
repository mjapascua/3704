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

router.post("/scan", protect, authAllow([ROLES.ADMIN, ROLES.EDITOR]), checkQR);

router.get("/users", protect, authAllow([ROLES.ADMIN]), getAllUsers);
router.delete(
  "/users/delete/:id",
  protect,
  authAllow([ROLES.EDITOR]),
  deleteUser
);
module.exports = router;
