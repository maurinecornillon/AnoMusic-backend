const router = require("express").Router();
const mongoose = require("mongoose");
const isAuthenticated = require("../middlewares/jwt.middleware");
const Favorites = require("../models/Favorites.model");

// GET ALL

router.get("/getAll", isAuthenticated, async (req, res, next) => {
  try {
    const allFavorites = await Favorites.find({
      user: req.payload.id,
    }).populate("publish");
    res.json(allFavorites);
  } catch (error) {
    next(error);
  }
});

// CREATE

router.post("/add/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const alreadyExist = await Favorites.findOne({
      user: req.payload.id,
      publish: id,
    });
    if (alreadyExist) {
      await Favorites.findByIdAndDelete(alreadyExist.id);
      return res.sendStatus(204);
    }
    const favorite = await Favorites.create({
      user: req.payload.id,
      publish: id,
    });
    res.status(201).json(favorite);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
