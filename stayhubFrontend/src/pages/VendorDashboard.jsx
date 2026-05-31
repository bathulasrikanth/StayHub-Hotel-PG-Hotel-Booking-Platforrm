import { useEffect, useState } from "react";
import axios from "axios";
import "../styling/vendordashboard.css";

function VendorDashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("access");

    axios
      .get("http://127.0.0.1:8000/api/auth/vendor/dashboard/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="vendor-wrapper">
      <h1>Vendor Dashboard</h1>

      <div className="vendor-grid">
        <div className="card">Properties: {data.total_properties}</div>
        <div className="card">Rooms: {data.total_rooms}</div>
        <div className="card">Bookings: {data.total_bookings}</div>
        <div className="card">Active: {data.active_bookings}</div>
        <div className="card">Cancelled: {data.cancelled_bookings}</div>
        <div className="card">Revenue: ₹{data.total_revenue}</div>
      </div>
    </div>
  );
}

export default VendorDashboard;