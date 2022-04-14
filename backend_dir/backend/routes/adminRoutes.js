const express = require("express");
const router = express.Router();
const { ROLES } = require("../config/roles");
const {
  deleteUser,
  getAllUsers,
  queueUserTagRegistration,
  tagRegistration,
  removeFromQueue,
  checkIfRegistered,
} = require("../controllers/adminRequestsController");
const { checkQR } = require("../controllers/qrController");
const { authAllow } = require("../controllers/roleController");
const { protect } = require("../middleware/authMiddleware");

//tag registration
router.get("/rfid/scan", (req, res) => {
  res.send("You are connected to the server!");
});
router.post("/rfid/register/queue", queueUserTagRegistration);
router.post("/rfid/register", tagRegistration);
router.get("/rfid/register/queue/:id", removeFromQueue);

router.post("/scan", protect, authAllow([ROLES.ADMIN, ROLES.EDITOR]), checkQR);

router.get("/users/is_registered/:id", protect, checkIfRegistered);

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
