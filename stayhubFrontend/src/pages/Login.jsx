import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styling/Login.css";

function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/api/auth/login/", formData)
      .then((res) => {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("role", res.data.role);

        if (res.data.role === "VENDOR") {
          navigate("/vendor/home");
        } else {
          navigate("/dashboard");
        }
      })
      .catch(() => alert("Invalid credentials"));
  };

  return (
    <div className="login-container">
      <div className="login-box">
      
        <div className="icon">👤</div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="USERNAME"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="PASSWORD"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">LOGIN</button>

        <p className="register-link">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>        
        </form>

      </div>
    </div>
  );
}

export default LoginPage;