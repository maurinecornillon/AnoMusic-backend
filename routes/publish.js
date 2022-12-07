const router = require("express").Router();
const mongoose = require("mongoose");
const uploader = require("../config/cloudinary");
const isAuthenticated = require("../middlewares/jwt.middleware");
const User = require("../models/User.model");
const Publish = require("../models/Publish.model");
const audioUploader = require("../config/audioUploader");
const localUploader = require("../config/localUploader");

// CREATE PUBLISH

router.post(
  "/music",
  isAuthenticated,
  localUploader.fields([
    { name: "cover", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),

  audioUploader,

  async (req, res, next) => {
    const { title, genre, user } = req.body;
    console.log(req.files);

    try {
      let newPublish = await Publish.create({
        title: title,
        genre: genre,
        cover: {
          name: req.files.cover.original_filename,
          url: req.files.cover.secure_url,
        },
        audio: {
          name: req.files.audio.original_filename,
          url: req.files.audio.secure_url,
        },
        user: req.payload.id,
      });
      res.status(201).json({ newPublish });
    } catch (error) {
      next(error);
    }
  }
);

// SEE ALL PUBLISH

router.get("/home", async (req, res) => {
  try {
    const publish = await Publish.find();
    res.json({ publish });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// SEE ONE PUBLISH
router.get("/music/:id", isAuthenticated, async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const response = await Publish.findById(id).populate("user");

    res.status(200).send(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
