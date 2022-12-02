const router = require("express").Router();
const mongoose = require("mongoose");
const uploader = require("../config/cloudinary");
const isAuthenticated = require("../middlewares/jwt.middleware");
const User = require("../models/User.model");
const Publish = require("../models/Publish.model");

router.post(
  "/music",
  uploader.single("cover"),
  uploader.single("audio"),
  isAuthenticated,
  async (req, res) => {
    const { title, genre } = req.body;

    try {
      let newPublish = await Publish.create(
        {
          title: title,
          genre: genre,
          cover: {
            name: req.file.originalname,
            url: req.file.path,
          },
          audio: {
            name: req.file.originalname,
            url: req.file.path,
          },
        },
        { new: true }
      );
      res.status(201).json({ newPublish });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);
module.exports = router;
