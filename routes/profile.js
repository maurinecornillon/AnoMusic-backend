const router = require("express").Router();
const mongoose = require("mongoose");
const uploader = require("../config/cloudinary");
const isAuthenticated = require("../middlewares/jwt.middleware");
const User = require("../models/User.model");
const Favorites = require("../models/Favorites.model");

router.get("/me", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.payload.id);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE PROFILE

router.post(
  "/updateme",
  uploader.single("image"),
  isAuthenticated,
  async (req, res) => {
    const { firstName, lastName, description, age } = req.body;

    try {
      let userUpdate;
      if (req.file) {
        userUpdate = await User.findByIdAndUpdate(
          req.payload.id,
          {
            firstName,
            lastName,
            description,
            age,
            image: {
              name: req.file.originalname,
              url: req.file.path,
            },
          },
          { new: true }
        );
      } else {
        userUpdate = await User.findByIdAndUpdate(
          req.payload.id,
          {
            firstName,
            lastName,
            description,
            age,
          },
          { new: true }
        );
      }
      await userUpdate.save();
      res.status(201).json({ userUpdate });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// FAVORITES

router.post(
  "/music/favorite/:id",
  isAuthenticated,

  async (req, res, next) => {
    const id = req.params.id;
    try {
      let newFavorite = await Favorites.create({
        publish: id,
        user: req.payload.id,
      });
      res.status(201).json({ newFavorite });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
