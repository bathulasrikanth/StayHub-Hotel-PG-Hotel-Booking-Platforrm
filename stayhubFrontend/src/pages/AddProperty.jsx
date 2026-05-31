import { useState } from "react";
import axios from "axios";
import "../styling/Addproperty.css";

function AddProperties() {
  const [form, setForm] = useState({
    name: "",
    property_type: "HOSTEL",
    address: "",
    city: "",
    description: "",
    amenities: "",
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
      .post("http://127.0.0.1:8000/api/auth/vendor/properties/", form, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => alert("Property Added ✅"))
      .catch((err) => console.log(err));
  };

  return (
    <div className="add-property-container">
      <div className="add-property-card">

        <h2>🏨 Add Property</h2>

        <form onSubmit={handleSubmit}>

          <input name="name" placeholder="Property Name" onChange={handleChange} required />

          <input name="city" placeholder="City" onChange={handleChange} required />

          <input name="address" placeholder="Address" onChange={handleChange} required />

          <textarea name="description" placeholder="Description" onChange={handleChange} />

          <input name="amenities" placeholder="Amenities (AC, WiFi, Lift...)" onChange={handleChange} />

          <select name="property_type" onChange={handleChange}>
            <option value="HOTEL">Hotel</option>
            <option value="PG">PG</option>
            <option value="HOSTEL">Hostel</option>
          </select>

          <button type="submit">Add Property</button>

        </form>

      </div>
    </div>
  );
}

export default AddProperties;