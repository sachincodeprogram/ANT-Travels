import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  name:        String,
  type:        String,
  pricePerKm:  Number,
  image:       String,
  ac:          { type: Boolean, default: true },
  seats:       { type: Number, default: 0 },
  description: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Vehicle", vehicleSchema);
