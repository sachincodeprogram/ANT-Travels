import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId:       String,
  userName:     String,
  userEmail:    String,
  vehicleId:    String,
  vehicleName:  String,
  vehicleType:  String,
  vehicleImage: String,
  pricePerKm:   Number,
  from:         String,
  to:           String,
  startDate:    String,
  endDate:      String,
  totalAmount:  Number,
  advanceAmount:Number,
  paymentType:  { type: String, enum: ["advance", "full", "later"] },
  paymentId:    String,
  status:       { type: String, default: "confirmed" },
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
