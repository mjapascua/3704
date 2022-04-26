const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
        throw new Error();
      }

      // Get user from the token
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        throw new Error();
      }

      req.user = user;

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const authAllow = (role) => {
  return asyncHandler(async (res, req, next) => {
    if (!role.includes(req.req.user.role)) {
      res.res.status(401);
      throw new Error("Unathorized, you do not meet permission requirements");
    }
    next();
  });
};

module.exports = { protect, authAllow };
