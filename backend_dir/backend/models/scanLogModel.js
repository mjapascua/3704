const mongoose = require("mongoose");

const ScanLogSchema = mongoose.Schema(
  {
    access_type: {
      type: String,
      required: true,
      enum: ["RegisteredTag", "AccessString"],
    },

    access_obj: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "access_type",
      required: true,
    },

    scan_point: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ScanPoint",
      required: true,
    },

    by_account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    by_reader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RFIDDevice",
    },
  },
  {
    timestamps: true,
  }
);

ScanLogSchema.statics.paginate = async function (
  pageNo,
  limit,
  filter,
  callback
) {
  const skip = limit * pageNo;
  let totalCount;
  let totalPages;

  const checkFilter = typeof filter !== undefined && filter ? filter : {};

  const count = await this.count(checkFilter);

  totalCount = !count ? 0 : count;
  totalPages = !count ? 0 : Math.ceil(count / limit);

  if (totalCount === 0) {
    return callback("No entries found", null);
  }

  this.find(checkFilter)
    .populate("by_account", "_id first_name last_name")
    .populate("scan_point", "_id label")
    .populate({
      path: "access_obj",
      select: "user_type -_id ",
      populate: { path: "used_by", select: "_id first_name last_name" },
    })
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

module.exports = mongoose.model("ScanLog", ScanLogSchema, "scan_logs");
