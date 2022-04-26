const mongoose = require("mongoose");
const { notifTypes } = require("../config/notifTypes");
const { ROLES } = require("../config/roles");

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "Please add your given name"],
    },

    last_name: {
      type: String,
      required: [true, "Please add your surname"],
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
    },

    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: [true, "Email is already taken"],
    },

    phone_number: {
      type: String,
      match: /^[0-9]*$/,
      minLength: 10,
      maxLength: 10,
      required: [true, "Please add a phone number"],
    },

    main_unique: {
      type: String,
      required: true,
    },

    residence: {
      type: String,
      required: [true, "Please add your residence"],
    },

    password: {
      type: String,
      required: [true, "Please add a password"],
    },

    visitor_form_link: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TempLink",
    },

    /*    guests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Guest",
      },
    ], */
    notifications: [
      {
        ref_link: String,
        title: String,
        category: { type: String, enum: Object.values(notifTypes) },
        text: String,
        read_status: Boolean,
        created_at: Date,
      },
    ],
  },

  {
    timestamps: true,
  }
);

userSchema.statics.paginate = function (pageNo, limit, filter, callback) {
  const skip = limit * (pageNo - 1);
  let totalCount;
  let totalPages;

  this.count({}, function (err, count) {
    totalCount = err ? 0 : count;
    totalPages = err ? 0 : Math.ceil(count / limit);
  });

  if (totalCount === 0) {
    return callback("No entries found", null);
  }

  const checkFilter = typeof filter !== undefined && filter ? filter : {};

  this.find(checkFilter)
    .skip(skip)
    .limit(limit)
    .exec(function (err, docs) {
      if (err) {
        return callback("Error in query", null);
      }
      if (!docs) {
        return callback("No entries found", null);
      } else {
        return callback(null, {
          total_count: totalCount,
          total_pages: totalPages,
          prev_page: pageNo >= 2 ? pageNo - 1 : null,
          current_page: pageNo,
          next_page: pageNo < totalPages ? pageNo + 1 : null,
          data: docs,
        });
      }
    });
};

module.exports = mongoose.model("User", userSchema);
