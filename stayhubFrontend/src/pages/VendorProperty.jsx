import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropertyImageUpload from "../components/PropertyImageUpload";
import "../styling/VendorDashboard.css";

function VendorProperties() {
  const [properties, setProperties] = useState([]);
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  const fetchProperties = () => {
    axios
      .get("http://127.0.0.1:8000/api/auth/vendor/properties/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProperties(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="vp-container">
      <h1 className="vp-title">🏨 My Properties</h1>

      <div className="vp-grid">
        {properties.length > 0 ? (
          properties.map((p) => (
            <div key={p.id} className="vp-card">

              {/* IMAGE */}
              {p.images?.length > 0 ? (
                <img
                  src={`http://127.0.0.1:8000${p.images[0].image}`}
                  alt={p.name}
                  className="vp-image"
                />
              ) : (
                <div className="vp-noimg">No Image</div>
              )}

              {/* UPLOAD */}
              <div className="vp-upload">
                <PropertyImageUpload
                  propertyId={p.id}
                  refreshProperties={fetchProperties}
                />
              </div>

              {/* DETAILS */}
              <div className="vp-content">
                <h3>{p.name}</h3>
                <p className="vp-city">📍 {p.city}</p>

                {/* STATUS */}
                <span className={`vp-status ${p.status.toLowerCase()}`}>
                  {p.status}
                </span>

                {/* BUTTONS */}
                <div className="vp-actions">
                  <button
                    className="vp-btn primary"
                    onClick={() =>
                      navigate(`/vendor/property/${p.id}/rooms`)
                    }
                  >
                    View Rooms
                  </button>

                  <button
                    className="vp-btn success"
                    onClick={() =>
                      navigate(`/vendor/add-room/${p.id}`)
                    }
                  >
                    ➕ Add Room
                  </button>
                </div>
              </div>

            </div>
          ))
        ) : (
          <p className="vp-empty">No properties found</p>
        )}
      </div>
    </div>
  );
}

export default VendorProperties;