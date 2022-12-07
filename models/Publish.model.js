const { Schema, model } = require("mongoose");

const publishSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    cover: {
      name: String,
      url: String,
    },
    audio: {
      name: String,
      url: String,
    },
    genre: {
      type: [String],

      enum: [
        "cold-wave",
        "post-punk",
        "new-wave",
        "hip-hop",
        "rock",
        "pop",
        "indie-pop",
        "EBM",
        "EDM",
      ],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = model("Publish", publishSchema);
