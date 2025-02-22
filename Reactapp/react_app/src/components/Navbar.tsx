import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/components/Navbar.css"

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="logo">LOGO</div>
      <div className="nav-menu">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/play" className="nav-item">Play</Link>
        <Link to="/help" className="nav-item">Help/Rules</Link>
        <Link to="/profile" className="nav-item">Profile</Link>
        <Link to="/settings" className="nav-item">Settings</Link>
        {!isLoggedIn ? (
          <>
            <Link to="/signin" className="nav-item button-border">Register</Link>
            <Link to="/register" className="nav-item button-border">Sign In</Link>
          </>
        ) : (
          <button className="nav-item button-border" onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
