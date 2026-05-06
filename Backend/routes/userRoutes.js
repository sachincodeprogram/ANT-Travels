import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET all users (admin)
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET profile by Firebase UID
router.get("/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    res.json(user || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE or UPDATE profile
router.post("/save", async (req, res) => {
  try {
    const { uid, name, email, photo, phone, address } = req.body;
    const user = await User.findOneAndUpdate(
      { uid },
      { uid, name, email, photo, phone, address },
      { upsert: true, new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
