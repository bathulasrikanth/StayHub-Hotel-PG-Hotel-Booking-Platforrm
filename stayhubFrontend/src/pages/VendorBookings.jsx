import { useEffect, useState } from "react";
import axios from "axios";

function VendorBookings() {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/auth/vendor/bookings/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBookings(res.data))
      .catch((err) => console.log(err));
  }, []);

  const updateStatus = (id, status) => {
    axios
      .patch(
        `http://127.0.0.1:8000/api/auth/vendor/bookings/${id}/update/`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        // update UI
        setBookings((prev) =>
          prev.map((b) =>
            b.id === id ? { ...b, status: status } : b
          )
        );
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="vendor-wrapper">
      <h1>📊 Booking Management</h1>

      <div className="vendor-grid">
        {bookings.map((b) => (
          <div key={b.id} className="vendor-card">

            <h3>{b.property_name}</h3>
            <p>Customer: {b.customer}</p>
            <p>Room: {b.room_type}</p>
            <p>{b.check_in} → {b.check_out}</p>
            <p>Qty: {b.quantity}</p>

            <p className={`status ${b.status.toLowerCase()}`}>
              {b.status}
            </p>

            {/* ACTION BUTTONS */}
            {b.status === "PENDING" && (
              <>
                <button
                  className="btn confirm"
                  onClick={() => updateStatus(b.id, "CONFIRMED")}
                >
                  ✔ Confirm
                </button>

                <button
                  className="btn cancel"
                  onClick={() => updateStatus(b.id, "CANCELLED")}
                >
                  ✖ Cancel
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VendorBookings;