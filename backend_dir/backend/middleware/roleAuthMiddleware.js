const asyncHandler = require("express-async-handler");

const authAllow = asyncHandler(async (role, req, res, next) => {
  if (req.user.role !== role) {
    res.status(401);
    throw new Error("Unathorized, you do not meet permission requirements");
  }
  next();
});

module.exports = { authAllow };
