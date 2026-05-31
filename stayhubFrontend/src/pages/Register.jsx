import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styling/register.css";

function RegisterPage() {
  const [formDetails, setFormDetails] = useState({
    username: "",
    password: "",
    email: "",
    role: "CUSTOMER",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormDetails({
      ...formDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/api/auth/register/", formDetails)
      .then(() => {
        alert("Registration Successful");
        navigate("/login");
      })
      .catch(() => {
        setError("Registration Failed");
      });
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2>Create Account</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formDetails.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formDetails.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formDetails.password}
            onChange={handleChange}
            required
          />

          {/* ROLE */}
          <select
            name="role"
            value={formDetails.role}
            onChange={handleChange}
          >
            <option value="CUSTOMER">Customer</option>
            <option value="VENDOR">Vendor</option>
          </select>

          <button type="submit">Register</button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;