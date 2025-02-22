import "../styles/pages/Register_Page.css";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <div className="register-page">
      <div className="register-content">
        <Navbar />
        <p className="register-title">Log In</p>
        <form className="register-form">
        <div className="signup-option">
          Don't have an account? <Link to="/signin">Sign Up</Link>
        </div>
          <label>Username</label>
          <input type="text" placeholder="Enter your username" required />
          <label>Password</label>
          <input type="password" placeholder="Enter your password" required />
          <button className="register-button">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;