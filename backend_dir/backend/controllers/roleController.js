const asyncHandler = require("express-async-handler");

const authAllow = (role) => {
  return asyncHandler(async (res, req, next) => {
    if (!role.includes(req.req.user.role)) {
      res.res.status(401);
      throw new Error("Unathorized, you do not meet permission requirements");
    } else next();
  });
};

module.exports = { authAllow };
