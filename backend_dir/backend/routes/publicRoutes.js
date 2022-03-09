const express = require("express");
const router = express.Router();
const { requestGuestQR, validateLink } = require("../controllers/qrController");

router.get("/visitor_form/:id/:uniq", validateLink, (req, res) =>
  res.json("success")
);
router.post("/visitor_form/submit/:id/:uniq", validateLink, requestGuestQR);

module.exports = router;
/* const authLink = asyncHandler((req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, "VISITOR_ONLY_FORM");

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
}); */
