import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styling/RoomList.css";

function RoomListPage() {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [property, setProperty] = useState(null); // 🔥 NEW
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [form, setForm] = useState({
    quantity: 1,
    check_in: "",
    check_out: "",
  });

  const token = localStorage.getItem("access");

  // =========================
  // FETCH ROOMS
  // =========================
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/auth/properties/${propertyId}/rooms/`)
      .then((res) => setRooms(res.data))
      .catch((err) => console.log(err));
  }, [propertyId]);

  // =========================
  // 🔥 FETCH PROPERTY (VENDOR INFO)
  // =========================
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/auth/properties/${propertyId}/`)
      .then((res) => setProperty(res.data))
      .catch((err) => console.log(err));
  }, [propertyId]);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // BOOKING FUNCTION
  // =========================
  const handleBooking = (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const data = {
      room: selectedRoom,
      quantity: form.quantity,
      check_in: form.check_in,
      check_out: form.check_out,
    };

    axios
      .post("http://127.0.0.1:8000/api/auth/room/booking/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const bookingId = res.data.booking_id;

        alert("✅ Booking Created Successfully!");
        navigate(`/payment/${bookingId}`);
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.error ||
          err.response?.data?.non_field_errors?.[0] ||
          "Booking failed ❌";

        alert(errorMessage);
      });
  };

  return (
    <div className="room-page-wrapper">

      <h1 className="room-page-title">🏠 Available Rooms</h1>

      {/* 🔥 VENDOR DETAILS */}
      {property && (
        <div className="vendor-info">
          <h3>👤 Owner: {property.vendor_name}</h3>
          <p>📞 {property.vendor_phone}</p>

          {/* 🔥 WhatsApp Button */}
          {property.vendor_phone && (
            <a
              href={`https://wa.me/${property.vendor_phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
            >
              💬 Chat on WhatsApp
            </a>
          )}
        </div>
      )}

      <div className="room-grid">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div key={room.id} className="room-card">

              {room.images?.length > 0 ? (
                <img
                  src={`http://127.0.0.1:8000${room.images[0].image}`}
                  alt="room"
                  className="room-card-image"
                />
              ) : (
                <div className="room-no-image">No Image</div>
              )}

              <div className="room-card-content">
                <h2>{room.room_type}</h2>
                <p className="room-price">💰 ₹{room.price}</p>
                <p className="room-units">
                  📦 {room.available_units} available
                </p>

                <p className={room.is_available ? "available" : "not-available"}>
                  {room.is_available ? "Available" : "Full"}
                </p>

                <button
                  className="room-btn"
                  disabled={!room.is_available}
                  onClick={() => setSelectedRoom(room.id)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <h3>No rooms available</h3>
        )}
      </div>

      {/* BOOKING MODAL */}
      {selectedRoom && (
        <div className="booking-overlay">
          <div className="booking-modal">

            <h2>📝 Book Room</h2>

            <form onSubmit={handleBooking}>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                required
              />

              <input
                type="date"
                name="check_in"
                value={form.check_in}
                onChange={handleChange}
                required
              />

              <input
                type="date"
                name="check_out"
                value={form.check_out}
                onChange={handleChange}
                required
              />

              <div className="booking-actions">
                <button type="submit" className="confirm-btn">
                  Confirm Booking
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setSelectedRoom(null)}
                >
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}

export default RoomListPage;

