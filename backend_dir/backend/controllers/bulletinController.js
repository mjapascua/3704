const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Article = require("../models/articleModel");
const Event = require("../models/eventModel");
const jwt = require("jsonwebtoken");
const { notifTypes } = require("../config/notifTypes");
const { createNotif } = require("./notificationController");

// @desc    Get Bulletin News
// @route   GET /api/bulletin/:id
// @access  Private
const getArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id, "-_id")
    .populate("author", "fname lname")
    .lean();

  if (!article) {
    res.status(404);
    throw new Error(err);
  }
  const likesNum = article.likes.length;
  const liked = req.viewer
    ? article.likes.some((id) => id.equals(req.viewer._id))
    : false;
  article.likes = likesNum;
  article.liked = liked;

  res.json({ ...article });
});

const viewerCheck = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      req.viewer = null;
    }
    const user = await User.findById(decoded.id);

    if (!user) {
      req.viewer = null;
    }

    req.viewer = user;
  } else {
    req.viewer = null;
  }
  next();
});

// @desc    Get Bulletin News
// @route   GET /api/bulletin/:id/like
// @access  Private
const interactArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id).populate(
    "author",
    "fname lname"
  );
  if (!article) {
    res.status(404);
    throw new Error(err);
  }
  const alreadyLiked = article.likes.some((id) => id.equals(req.viewer._id));
  if (alreadyLiked) {
    const ind = article.likes.indexOf(req.viewer._id);
    article.likes.splice(ind, 1);
    await article.save();

    const doc = article.toObject();
    const likesNum = doc.likes.length;
    doc.likes = likesNum;
    doc.liked = false;
    res.json(doc);
  } else {
    const likesNum = article.likes.push(req.viewer._id);
    await article.save();
    const doc = article.toObject();
    doc.likes = likesNum;
    doc.liked = true;
    res.json(doc);
  }
});

const getBulletinPosts = asyncHandler(async (req, res) => {
  Article.paginate(
    parseInt(req.query.page),
    parseInt(req.query.limit),
    req.body,
    function (err, docs) {
      if (err) {
        res.status(404);
        throw new Error(err);
      } else res.json(docs);
    }
  );
});
// @desc    Set Bulletin News
// @route   POST /api/bulletin
// @access  Private
const createBulletinPost = asyncHandler(async (req, res) => {
  if (!req.body.text || !req.body.title || !req.body.header_url) {
    res.status(400);
    throw new Error("Missing field");
  }
  const exists = await Article.findOne({
    title: req.body.title,
  }).lean();
  if (exists) {
    res.status(400);
    throw new Error("Post with same title already exists");
  }
  const bulletinPost = await Article.create({
    author: req.user.id,
    title: req.body.title,
    text: req.body.text,
    image_urls: req.body.image_urls || [],
    header_image: { url: req.body.header_url, text: req.body.header_text },
    likes: [],
    tags: req.body.tags,
  });

  await createNotif({
    title: "New post",
    type: notifTypes.new_event,
    text: req.body.title,
  });

  if (!bulletinPost) {
    res.status(400);
    throw new Error("Creation failed");
  }

  res.status(201).json(bulletinPost.id);
});

// @desc    Update Bulletin News
// @route   PUT /api/bulletin/:id
// @access  Private
const updateBulletinPost = asyncHandler(async (req, res) => {
  const bulletinPost = await Article.findById(req.params.id);

  if (!bulletinPost) {
    res.status(400);
    throw new Error("Bulletin News not found");
  }

  const updatedArticle = await Article.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedArticle);
});

// @desc    Delete Bulletin News
// @route   DELETE /api/bulletin
// @access  Private
const deleteBulletinPost = asyncHandler(async (req, res) => {
  const bulletinPost = await Article.findById(req.params.id);

  if (!bulletinPost) {
    res.status(400);
    throw new Error("Bulletin News not found");
  }

  await bulletinPost.remove();

  res.status(200).json({ id: req.params.id });
});

// @desc    Get events
// @route   GET /api/bulletin/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
  Event.paginate(
    parseInt(req.query.page),
    parseInt(req.query.limit),
    req.body,
    function (err, docs) {
      if (err) {
        res.status(404);
        throw new Error(err);
      } else res.json(docs);
    }
  );
});
// @desc    Make an event
// @route   POST /api/bulletin/events
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
  if (!req.body.text || !req.body.title || !req.body.header_url) {
    res.status(400);
    throw new Error("Missing field");
  }

  const newEvent = await Event.create({
    author: req.user.id,
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
  }).lean();

  if (!newEvent) {
    res.status(400);
    throw new Error("Creation failed");
  }

  await createNotif({
    title: "New event: " + req.body.title,
    type: notifTypes.new_event,
    text: req.body.description,
  });

  res.status(201).json(newEvent.id);
});

module.exports = {
  getArticle,
  getBulletinPosts,
  createBulletinPost,
  updateBulletinPost,
  deleteBulletinPost,
  getEvents,
  createEvent,
  interactArticle,
  viewerCheck,
};
