const router = require("express").Router();
const mongoose = require("mongoose");
const uploader = require("../config/cloudinary");
const isAuthenticated = require("../middlewares/jwt.middleware");
const User = require("../models/User.model");
const Publish = require("../models/Publish.model");
const audioUploader = require("../config/audioUploader");
const localUploader = require("../config/localUploader");
const Favorites = require("../models/Favorites.model");

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

router.get("/home", isAuthenticated, async (req, res) => {
  try {
    const myFavorites = await Favorites.find({ user: req.payload.id });
    const publish = await Publish.find();
    const publishObject = JSON.parse(JSON.stringify(publish));
    for (const pub of publishObject) {
      const foundFav = myFavorites.find(
        (fav) => fav.publish.toString() === pub._id.toString()
      );
      if (foundFav) {
        pub.isFav = true;
      }
    }
    res.json({ publishObject });
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

// DELETE PUBLISH

router.post("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    Publish.findByIdAndRemove(id);
    res.status(200);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
