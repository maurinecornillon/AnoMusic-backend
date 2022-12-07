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
    console.log(req.files);
    // console.log("=======", { files: req.files });
    // console.log(req.files.cover, req.files.audio);

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
      });
      res.status(201).json({ newPublish });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/home", async (req, res) => {
  try {
    const publish = await Publish.find();
    res.json({ publish });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// router.get("/publish/:id", async (req, res) => {
//   console.log(req.params);
//   try {
//     const publishToShow = await Offer.findById(req.params.id).populate({
//       path: "owner",
//       select: "account.username email -_id",
//     });
//     res.json(publishToShow);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

module.exports = router;
