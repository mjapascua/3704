const { ROLES } = require("../config/roles");
const {
  deleteUser,
  getAllUsers,
} = require("../controllers/adminRequestsController");
const { checkQR } = require("../controllers/qrController");
const { authAllow } = require("../middleware/roleAuthMiddleware");

router.post("/scan", protect, authAllow(ROLES.EDITOR), checkQR);

router.get("/users", protect, authAllow(ROLES.ADMIN), getAllUsers);
router.delete(
  "/users/delete/:id",
  protect,
  authAllow(ROLES.EDITOR),
  deleteUser
);
