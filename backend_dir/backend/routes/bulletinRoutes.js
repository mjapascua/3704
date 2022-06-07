const express = require("express");
const router = express.Router();
const {
  getArticle,
  getBulletinPosts,
  createBulletinPost,
  updateBulletinPost,
  deleteBulletinPost,
  getEvents,
  createEvent,
  interactArticle,
  viewerCheck,
} = require("../controllers/bulletinController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getBulletinPosts).post(protect, createBulletinPost);
router.route("/events").post(getEvents).post(protect, createEvent);

router.route("/:id/like").get(viewerCheck, interactArticle);
router
  .route("/:id")
  .get(viewerCheck, getArticle)
  .delete(deleteBulletinPost)
  .put(updateBulletinPost);

module.exports = router;
