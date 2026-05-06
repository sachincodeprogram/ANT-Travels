import express from "express";
import Razorpay from "razorpay";

const router = express.Router();

// 🔥 CREATE ORDER
router.post("/create-order", async (req, res) => {
  try {
    // ✅ DEBUG (check env loaded)
    console.log("KEY:", process.env.RAZORPAY_KEY_ID);

    // ❗ safety check
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        error: "Razorpay keys missing (.env check karo)",
      });
    }

    // 🔥 Razorpay instance (IMPORTANT: yahin banana hai)
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount required" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // paisa convert
      currency: "INR",
    });

    res.json(order);

  } catch (err) {
    console.log("Payment Error:", err);
    res.status(500).json({ error: "Payment Failed" });
  }
});

export default router;