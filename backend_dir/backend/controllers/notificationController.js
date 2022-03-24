const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { notifTypes } = require("../config/notifTypes");

const createNotif = async (body, scope) => {
  if (!Object.values(notifTypes).includes(body.category)) {
    return new Error("Invalid classification");
  }
  let user;
  const newNotif = {
    ...body,
    read_status: false,
    created_at: new Date(),
  };
  if (!scope) {
    user = await User.updateMany(
      {},
      {
        $push: {
          notifications: newNotif,
        },
      }
    );
  } else if (scope.id) {
    user = await User.findByIdAndUpdate(scope.id, {
      $push: {
        notifications: newNotif,
      },
    });
  } else {
    user = await User.updateMany(scope, {
      $push: {
        notifications: newNotif,
      },
    });
  }

  if (!user) {
    return new Error("Failed! user was not found");
  }

  return user;
};

const getNotifs = asyncHandler(async (req, res) => {
  const { notifications } = await User.findById(req.user.id);
  const unreadCount = notifications.filter((nf) => !nf.read_status).length;

  res.json({
    unreadCount,
    notifications: notifications.slice(-10).reverse(),
  });
});

const readNotifs = asyncHandler(async (req, res) => {
  const { notifications } = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: { "notifications.$[el].read_status": true },
    },
    { arrayFilters: [{ "el.read_status": false }] }
  );

  res.json({
    notifications: notifications.slice(-10).reverse(),
  });
});

module.exports = {
  createNotif,
  getNotifs,
  readNotifs,
};
