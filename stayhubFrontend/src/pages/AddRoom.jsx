import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styling/AddRoom.css";

function AddRooms() {
  const { propertyId } = useParams();

  const [form, setForm] = useState({
    property: propertyId,
    room_type: "SINGLE",
    price: "",
    total_units: "",
    available_units: "",
  });

  const token = localStorage.getItem("access");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/api/auth/vendor/rooms/", form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Room Added Successfully ✅");
        setForm({
          property: propertyId,
          room_type: "SINGLE",
          price: "",
          total_units: "",
          available_units: "",
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="add-room-container">
      <div className="add-room-card">

        <h2>🛏️ Add Room</h2>

        <p className="property-id">Property ID: {propertyId}</p>

        <form onSubmit={handleSubmit}>

          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={form.price}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="total_units"
            placeholder="Total Units"
            value={form.total_units}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="available_units"
            placeholder="Available Units"
            value={form.available_units}
            onChange={handleChange}
            required
          />

          <select
            name="room_type"
            value={form.room_type}
            onChange={handleChange}
          >
            <option value="SINGLE">Single</option>
            <option value="DOUBLE">Double</option>
            <option value="BED">Bed</option>
          </select>

          <button type="submit">Add Room</button>

        </form>

      </div>
    </div>
  );
}

export default AddRooms;