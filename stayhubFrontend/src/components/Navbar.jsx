import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styling/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("access");

  // 🔥 Navigate + close menu (important for mobile UX)
  const go = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("role");
    go("/");
  };

  return (
    <nav className="navbar">
      {/* LOGO */}
      <h1 className="logo" onClick={() => go("/")}>
        Stay<span>Hub</span>
      </h1>

      {/* HAMBURGER */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* NAV LINKS */}
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>

        {/* COMMON */}
        <button className="btn" onClick={() => go("/")}>Home</button>

        {/* NOT LOGGED */}
        {!token && (
          <>
            <button className="btn" onClick={() => go("/login")}>Login</button>
            <button className="btn" onClick={() => go("/register")}>Register</button>
          </>
        )}

        {/* CUSTOMER */}
        {token && role === "CUSTOMER" && (
          <>
            <button className="btn" onClick={() => go("/properties")}>
              Properties
            </button>

            <button className="btn" onClick={() => go("/dashboard")}>
              My Bookings
            </button>

            <button className="btn logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

        {/* VENDOR */}
        {token && role === "VENDOR" && (
          <>
            <button className="btn" onClick={() => go("/vendor/dashboard")}>
              Dashboard
            </button>

            <button className="btn" onClick={() => go("/vendor/add-property")}>
              Add Property
            </button>

            <button className="btn" onClick={() => go("/vendor/properties")}>
              My Properties
            </button>

            <button className="btn" onClick={() => go("/vendor/bookings")}>
              Bookings
            </button>

            <button className="btn logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;