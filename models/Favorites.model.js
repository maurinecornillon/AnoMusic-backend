const { Schema, model } = require("mongoose");

const favoriteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    publish: {
      type: Schema.Types.ObjectId,
      ref: "Publish",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = model("Favorites", favoriteSchema);
