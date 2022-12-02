const router = require("express").Router();
const mongoose = require("mongoose");
const isAuthenticated = require("../middlewares/jwt.middleware");
const User = require("../models/User.model");

router.get("/me", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.payload.id);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/updateme", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.payload.id);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
module.exports = router;
