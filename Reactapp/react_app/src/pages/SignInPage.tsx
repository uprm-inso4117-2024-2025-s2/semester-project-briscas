import React, { useState } from "react";
import "../styles/pages/SignIn_Page.css";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Example list of country codes with initials
  const countryCodes = [
    { code: "+1", initials: "US", name: "United States" },
    { code: "+1", initials: "PR", name: "Puerto Rico" },
    { code: "+44", initials: "UK", name: "United Kingdom" },
    { code: "+91", initials: "IN", name: "India" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Simulate invalid credentials
    if (email !== "test@example.com" || password !== "password123") {
      setError("Invalid email or password.");
      return;
    }

    // Clear error on successful validation
    setError("");
    alert("Sign up successful!"); // Replace with actual sign-up logic
  };

  return (
    <div className="signin-page">
      <div className="signin-content">
        <Navbar />
        <p className="signin-title">Sign Up</p>
        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="name-fields">
            <div>
              <label>First Name</label>
              <input type="text" placeholder="Enter first name" required />
            </div>
            <div>
              <label>Last Name</label>
              <input type="text" placeholder="Enter last name" required />
            </div>
          </div>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Phone Number</label>
          <div className="phone-number-field">
            <select className="country-code-select">
              {countryCodes.map((country, index) => (
                <option key={index} value={country.code}>
                  {country.initials} ({country.code})
                </option>
              ))}
            </select>
            <input type="tel" placeholder="Enter your phone number" required />
          </div>
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="error-message">{error}</div>}
          <div className="button-login-container">
            <button type="submit" className="signin-button">
              Sign Up
            </button>
            <div className="login-option">
              Already have an account? <Link to="/login">Log in</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;