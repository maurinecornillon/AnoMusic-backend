const router = require("express").Router();
const mongoose = require("mongoose");
const uploader = require("../config/cloudinary");
const isAuthenticated = require("../middlewares/jwt.middleware");
const User = require("../models/User.model");
const Publish = require("../models/Publish.model");
const audioUploader = require("../config/audioUploader");
const localUploader = require("../config/localUploader");

router.post(
  "/music",
  isAuthenticated,
  localUploader.fields([
    { name: "cover", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),

  audioUploader,

  async (req, res, next) => {
    const { title, genre } = req.body;

    console.log("=======", { files: req.files });
    // console.log(req.files.cover, req.files.audio);
    // return;
    try {
      let newPublish = await Publish.create({
        title: title,
        genre: genre || "EDM",
        cover: {
          name: req.files.cover.originalname,
          url: req.files.cover.path,
        },
        audio: {
          name: req.files.audio.originalname,
          url: req.files.audio.path,
        },
      });
      res.status(201).json({ newPublish });
    } catch (error) {
      next(error);
    }
  }
);
module.exports = router;
