import React, { useState } from "react"; // Import useState
import "../styles/pages/Register_Page.css";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle the state
  };

  return (
    <div className="register-page">
      <div className="register-content">
        <Navbar />
        {/* Gray circle representing the profile picture */}
        <div className="profile-picture-circle"></div>
        <p className="register-title">Log In</p>
        <form className="register-form">
          <div className="signup-option">
            Don't have an account? <Link to="/signin">Sign Up</Link>
          </div>
          <label>Your Email or Username</label>
          <input type="text" placeholder="Enter your username" required />
          <div className="password-label-container">
            <label>Your Password</label>
            <button
              type="button" // Prevent form submission
              className="toggle-password-button"
              onClick={togglePasswordVisibility}
            >
              <span role="img" aria-label="toggle-password">
                {showPassword ? "👁️‍🗨️ Hide" : "👁️ Show"} {/* Eye symbol + text */}
              </span>
            </button>
          </div>
          <input
            type={showPassword ? "text" : "password"} // Toggle input type
            placeholder="Enter your password"
            required
          />
          <button className="register-button">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;