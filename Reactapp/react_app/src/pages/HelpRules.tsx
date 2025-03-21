import React from "react";
import Navbar from "../components/Navbar";

const HelpRules = () => {
  return (
    <>
      <Navbar />
      <div className="page-content">
        <h1>Help & Rules</h1>
        <p>Welcome to the Help & Rules page! Here you'll find guidelines on how to play.</p>
        <h2>Basic Rules</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li>✅ Rule 1: Follow the game mechanics.</li>
          <li>✅ Rule 2: Be respectful to other players.</li>
          <li>✅ Rule 3: No cheating or exploiting bugs.</li>
        </ul>

        <h2>Need Help?</h2>
        <p>If you have any issues, contact support at <strong>support@example.com</strong>.</p>
      </div>
    </>
  );
};

export default HelpRules;
