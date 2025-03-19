import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/components/Navbar.css"
import logoIMG from "../assets/logoIMG.png"

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={logoIMG} alt="logoIMG" className="logoIMG" />
        </Link>
      </div>
      <div className="nav-menu">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/GameBoard" className="nav-item">Play</Link>
        <Link to="/help" className="nav-item">Help/Rules</Link>
        <Link to="/profile" className="nav-item">Profile</Link>
        <Link to="/settings" className="nav-item">Settings</Link>
        {!isLoggedIn ? (
          <>
            <Link to="/signin" className="nav-item button-border">Sign Up</Link>
            <Link to="/register" className="nav-item button-border">Log In</Link>
          </>
        ) : (
          <button className="nav-item button-border" onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;






