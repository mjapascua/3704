const mongoose = require("mongoose");

const ScanLogSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["rf", "qr"],
    },

    u_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    g_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
    },

    loc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ScanPoint",
      required: true,
    },

    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    node: {
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
  body,
  callback
) {
  const skip = limit * pageNo;
  let totalCount;
  let totalPages;

  const checkFilter =
    typeof body.filter !== undefined && body.filter ? body.filter : {};

  const count = await this.count(checkFilter);

  totalCount = !count ? 0 : count;
  totalPages = !count ? 1 : Math.ceil(count / limit);

  if (totalCount === 0) {
    return callback(null, { data: [] });
  }

  this.find(checkFilter)
    .lean()
    .populate("by", "first_name last_name")
    .populate("loc", "label")
    .populate("u_id", "first_name last_name")
    .populate("g_id", "fname lname")
    .sort({ createdAt: body.order || -1 })
    .skip(skip)
    .limit(limit)
    .exec(function (err, docs) {
      if (err) {
        return callback(err, null);
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
