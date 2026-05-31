import { useEffect, useState } from "react";
import axios from "axios";
import "../styling/MyBookings.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("access");

  // =========================
  // FETCH BOOKINGS
  // =========================
  const fetchBookings = () => {
    axios
      .get("http://127.0.0.1:8000/api/auth/bookings/my/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBookings(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // =========================
  // CANCEL BOOKING
  // =========================
  const handleCancel = (id) => {
    axios
      .put(
        `http://127.0.0.1:8000/api/auth/bookings/${id}/cancel/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("Booking Cancelled ❌");
        fetchBookings(); // refresh
      })
      .catch((err) => {
        alert(err.response?.data?.error || "Error");
      });
  };

  return (
    <div className="mybook-wrapper">
      <h1 className="mybook-title">📋 My Bookings</h1>

      <div className="mybook-grid">
        {bookings.length > 0 ? (
          bookings.map((b) => (
            <div key={b.id} className="mybook-card">

              <h2>{b.property_name}</h2>

              <p><strong>Room:</strong> {b.room_type}</p>

              <p>
                📅 {b.check_in} → {b.check_out}
              </p>

              <p>👥 Quantity: {b.quantity}</p>

              <p className="price">💰 ₹{b.total_price}</p>

              {/* STATUS */}
              <span className={`status ${b.status.toLowerCase()}`}>
                {b.status}
              </span>

              {/* CANCEL BUTTON */}
              {b.status === "PENDING" && (
                <button
                  className="cancel-btn"
                  onClick={() => handleCancel(b.id)}
                >
                  Cancel Booking
                </button>
              )}

            </div>
          ))
        ) : (
          <h3>No bookings found</h3>
        )}
      </div>
    </div>
  );
}

export default MyBookings;