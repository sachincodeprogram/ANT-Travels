import axios from "axios";

const API     = import.meta.env.VITE_API          || "https://ant-travels-4c1n.onrender.com/api";
const RZP_KEY = import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_SlAYzNNJzlvLCY";

const Payment = ({ amount, onSuccess }) => {

  const handlePayment = async () => {
    try {
      const { data } = await axios.post(`${API}/payment/create-order`, { amount });

      const options = {
        key:      RZP_KEY,
        amount:   data.amount,
        currency: "INR",
        order_id: data.id,
        handler: (response) => {
          onSuccess(response.razorpay_payment_id);
        },
        theme: { color: "#3b82f6" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment Failed âŒ");
    }
  };

  return (
    <button className="btn btn-warning mt-3" onClick={handlePayment}>
      Pay â‚¹{amount}
    </button>
  );
};

export default Payment;

