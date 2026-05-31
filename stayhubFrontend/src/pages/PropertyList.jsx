import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styling/PropertyList.css";

function PropertyListPage() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/auth/properties/")
      .then((res) => setProperties(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="property-page-wrapper">
      <h1 className="property-page-title">🏨 Available Properties</h1>

      <div className="property-page-grid">
        {properties.length > 0 ? (
          properties.map((property) => (
            <div key={property.id} className="property-card">

              {/* IMAGE */}
              {property.images?.length > 0 ? (
                <img
                  src={`http://127.0.0.1:8000${property.images[0].image}`}
                  alt={property.name}
                  className="property-card-image"
                />
              ) : (
                <div className="property-no-image">No Image</div>
              )}

              {/* CONTENT */}
              <div className="property-card-content">
                <h2 className="property-name">{property.name}</h2>

                <p className="property-location">
                  📍 {property.city} | {property.property_type}
                </p>

                <p className="property-desc">
                  {property.description?.slice(0, 100)}...
                </p>

                {/* 🔥 AMENITIES TAGS */}
                <div className="property-amenities">
                  {property.amenities?.split(",").map((item, index) => (
                    <span key={index} className="amenity-tag">
                      {item.trim()}
                    </span>
                  ))}
                </div>

                {/* STATUS */}
                <p
                  className={
                    property.is_available
                      ? "property-status-available"
                      : "property-status-unavailable"
                  }
                >
                  {property.is_available ? "Available" : "Not Available"}
                </p>

                {/* BUTTON */}
                <button
                  className="property-btn"
                  onClick={() => navigate(`/property/${property.id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <h3>No properties found</h3>
        )}
      </div>
    </div>
  );
}

export default PropertyListPage;