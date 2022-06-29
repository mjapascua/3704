const mongoose = require("mongoose");

const articleSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tags: [
      {
        type: String,
        enum: ["event", "news", "report", "inquiry", "announcement"],
      },
    ],

    header_image: {
      url: String,
      text: String,
    },
    image_urls: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

articleSchema.statics.paginate = async function (
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
  totalPages = !count ? 1 : Math.ceil(count / limit);

  if (totalCount === 0) {
    return callback(null, { data: [] });
  }

  this.find(checkFilter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
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

module.exports = mongoose.model("Article", articleSchema);
