import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  uid:     { type: String, required: true, unique: true },
  name:    { type: String, default: "" },
  email:   { type: String, default: "" },
  photo:   { type: String, default: "" },
  phone:   { type: String, default: "" },
  address: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
