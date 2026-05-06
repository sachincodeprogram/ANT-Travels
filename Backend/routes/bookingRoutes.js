import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

// GET ALL BOOKINGS — admin
router.get("/all", async (req, res) => {
  try {
    const data = await Booking.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET BOOKINGS BY USER
router.get("/:userId", async (req, res) => {
  try {
    const data = await Booking.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SAVE BOOKING
router.post("/save", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
