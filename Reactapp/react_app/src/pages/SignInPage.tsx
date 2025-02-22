import "../styles/pages/SignIn_Page.css";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";


const SignInPage = () => {
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
          <label>Password</label>
          <input type="password" placeholder="Enter your password" required />
          <button className="signin-button">Sign Up</button>
        </form>
        <div className="divider">or</div>
        <button className="google-signin-button">Sign up with Google</button>

        <div className="login-option">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;