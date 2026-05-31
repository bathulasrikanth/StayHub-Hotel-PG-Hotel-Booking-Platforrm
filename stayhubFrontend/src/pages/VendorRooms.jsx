import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import RoomImageUpload from "../components/RoomImageUpload";
import "../styling/Vendorroom.css";

function VendorRooms() {
  const { propertyId } = useParams();
  const [rooms, setRooms] = useState([]);

  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  const fetchRooms = () => {
    axios
      .get("http://127.0.0.1:8000/api/auth/vendor/rooms/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const filtered = res.data.filter(
          (room) => room.property === Number(propertyId)
        );
        setRooms(filtered);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchRooms();
  }, [propertyId]);

  return (
    <div className="vr-container">
      <h1 className="vr-title">🛏️ Property Rooms</h1>

      <button
        className="vr-add-btn"
        onClick={() => navigate(`/vendor/add-room/${propertyId}`)}
      >
        ➕ Add Room
      </button>

      <div className="vr-grid">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div key={room.id} className="vr-card">

              {/* IMAGE */}
              {room.images?.length > 0 ? (
                <img
                  src={`http://127.0.0.1:8000${room.images[0].image}`}
                  alt="room"
                  className="vr-img"
                />
              ) : (
                <div className="vr-noimg">No Image</div>
              )}

              {/* UPLOAD */}
              <div className="vr-upload">
                <RoomImageUpload
                  roomId={room.id}
                  refreshRooms={fetchRooms}
                />
              </div>

              {/* DETAILS */}
              <div className="vr-content">
                <h3>{room.room_type}</h3>

                <p className="vr-price">💰 ₹{room.price}</p>

                <p className="vr-units">
                  📦 {room.available_units} / {room.total_units}
                </p>

                <span
                  className={
                    room.is_available ? "vr-status available" : "vr-status full"
                  }
                >
                  {room.is_available ? "Available" : "Full"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="vr-empty">No rooms added yet</p>
        )}
      </div>
    </div>
  );
}

export default VendorRooms;