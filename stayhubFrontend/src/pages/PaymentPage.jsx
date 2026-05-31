import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../styling/Payment.css";

function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 Create Payment
  const handleCreatePayment = () => {
    setLoading(true);

    axios
      .post(
        "http://127.0.0.1:8000/api/auth/create/payment/",
        { booking_id: bookingId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setPaymentData(res.data);
      })
      .catch((err) => {
        alert(err.response?.data?.error);
      })
      .finally(() => setLoading(false));
  };

  // ✅ SUCCESS
  const handleSuccess = () => {
    axios
      .post(
        "http://127.0.0.1:8000/api/auth/payment/success/",
        {
          payment_id: paymentData.payment_id,
          provider_payment_id: "MOCK_TXN_123",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("✅ Payment Successful!");
        navigate("/dashboard"); // 🔥 redirect to bookings
      });
  };

  // ❌ FAILURE
  const handleFailure = () => {
    axios.post(
      "http://127.0.0.1:8000/api/auth/payment/failure/",
      {
        payment_id: paymentData.payment_id,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("❌ Payment Failed — Try Again");
  };

  return (
    <div className="pay-container">
      <div className="pay-card">

        <h2>💳 Complete Payment</h2>

        {!paymentData ? (
          <button className="pay-main-btn" onClick={handleCreatePayment}>
            {loading ? "Processing..." : "Proceed to Pay"}
          </button>
        ) : (
          <>
            <h3>Amount: ₹{paymentData.amount}</h3>

            <button className="pay-success" onClick={handleSuccess}>
              Pay Now
            </button>

            <button className="pay-fail" onClick={handleFailure}>
              Cancel Payment
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default PaymentPage;