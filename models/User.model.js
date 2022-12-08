const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: [/[^@]/, "@ not allowed on username"],
    },
    firstName: {
      type: String,
      max: 50,
    },
    lastName: {
      type: String,
      max: 50,
    },
    age: {
      type: Number,
    },
    description: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [
        /(\w+\.?|-?\w+?)+@\w+\.?-?\w+?(\.\w{2,3})+/,
        "not a valid email address",
      ],
    },
    image: {
      name: String,
      url: String,
    },
    // publish: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Publish",
    // },
    password: String,
  },

  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
