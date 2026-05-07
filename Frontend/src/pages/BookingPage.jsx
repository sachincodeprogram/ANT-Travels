import { useLocation } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API || "https://ant-travels-4c1n.onrender.com/api";

const Booking = () => {
  const { state } = useLocation();
  const vehicle = state?.vehicle;

  const handlePayment = async () => {
    try {
      const res = await axios.post(`${API}/payment/create-order`, {
        amount: vehicle.pricePerKm * 10, // demo calculation
      });

      const order = res.data;

      const options = {
        key: "YOUR_KEY_ID",
        amount: order.amount,
        currency: "INR",
        name: "Travel Booking",
        description: vehicle.name,
        order_id: order.id,

        handler: function (response) {
          alert("Payment Successful âœ…");
          console.log(response);
        },

        theme: {
          color: "#000",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.log(err);
    }
  };

  if (!vehicle) return <h3>No Vehicle Selected</h3>;

  return (
    <div className="container mt-5 text-center">
      <h2>{vehicle.name}</h2>
      <p>₹{vehicle.pricePerKm}/km</p>

      <button className="btn btn-dark" onClick={handlePayment}>
        Pay Now
      </button>
    </div>
  );
};

export default Booking;
