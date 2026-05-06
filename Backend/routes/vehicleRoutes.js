import express from "express";
import Vehicle from "../models/Vehicle.js";

const router = express.Router();

console.log("✅ Vehicle Routes Loaded");

// GET ALL
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json({ success: true, data: vehicles });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ADD VEHICLE
router.post("/add-vehicle", async (req, res) => {
  try {
    const { name, type, pricePerKm, image, ac, seats, description } = req.body;
    if (!name || !type || !pricePerKm) {
      return res.status(400).json({ success: false, message: "Name, type and price are required" });
    }
    const vehicle = new Vehicle({
      name,
      type: type.toLowerCase().trim(),
      pricePerKm,
      image,
      ac: ac !== undefined ? ac : true,
      seats: seats || 0,
      description: description || "",
    });
    await vehicle.save();
    res.json({ success: true, message: "Vehicle Added", data: vehicle });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// EDIT VEHICLE
router.put("/:id", async (req, res) => {
  try {
    const { name, type, pricePerKm, image, ac, seats, description } = req.body;
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      {
        name,
        type: type?.toLowerCase().trim(),
        pricePerKm,
        image,
        ac: ac !== undefined ? ac : true,
        seats: seats || 0,
        description: description || "",
      },
      { new: true }
    );
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });
    res.json({ success: true, data: vehicle });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// DELETE VEHICLE
router.delete("/:id", async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Vehicle deleted" });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;
