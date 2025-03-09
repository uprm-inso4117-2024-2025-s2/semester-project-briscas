import "../styles/pages/SignIn_Page.css";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const SignInPage = () => {
  // Example list of country codes with initials
  const countryCodes = [
    { code: "+1", initials: "US", name: "United States" },
    { code: "+1", initials: "PR", name: "Puerto Rico" }, // Added Puerto Rico
    { code: "+44", initials: "UK", name: "United Kingdom" },
    { code: "+91", initials: "IN", name: "India" },
    // Add more country codes as needed
  ];

  return (
    <div className="signin-page">
      <div className="signin-content">
        <Navbar />
        <p className="signin-title">Sign Up</p>
        <form className="signin-form">
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
          <input type="email" placeholder="Enter your email" required />
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
          <input type="password" placeholder="Enter your password" required />
          <div className="button-login-container">
            <button className="signin-button">Sign Up</button>
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