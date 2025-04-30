import React from "react";
import Navbar from "../components/Navbar";
import "../styles/pages/HelpRules_Page.css";

const HelpRules = () => {
  return (
    <div className="helprules-page">
      <div className="helprules-content">
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

          <h2>Briscas Rules</h2>
          <p><strong>Objective:</strong> Score more points than your opponent by winning tricks.</p>
          <p><strong>Players:</strong> 2 players using a 40-card Spanish deck.</p>

          <p><strong>Card Values:</strong></p>
          <ul>
            <li>
              <img 
                src="/assets/cards/bastos_1.png" 
                alt="Ace card" 
                style={{ width: "60px", verticalAlign: "middle", marginRight: "8px" }} 
              />
              Ace (As): 11 points
            </li>
            <li>
              <img 
                  src="/assets/cards/bastos_3.png" 
                  alt="Three card" 
                  style={{ width: "60px", verticalAlign: "middle", marginRight: "8px" }} 
                />
                Three (3): 10 points
            </li>
            <li>
              <img 
                src="/assets/cards/bastos_12.png" 
                alt="Three card" 
                style={{ width: "60px", verticalAlign: "middle", marginRight: "8px" }} 
              />
              King (Rey): 4 points
            </li>
            <li>
              <img 
                  src="/assets/cards/bastos_11.png" 
                  alt="Three card" 
                  style={{ width: "60px", verticalAlign: "middle", marginRight: "8px" }} 
              />
              Knight (Caballo): 3 points
            </li>
            <li>
              <img 
                  src="/assets/cards/bastos_10.png" 
                  alt="Three card" 
                  style={{ width: "60px", verticalAlign: "middle", marginRight: "8px" }} 
              />
              Jack (Sota): 2 points
            </li>
            <li>Rest of the Cards: 0 points</li>
          </ul>

          <p><strong>Gameplay:</strong></p>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <img 
              src="/assets/Gameboard.png" 
              alt="Game board" 
              style={{ width: "140px", maxWidth: "100%", borderRadius: "8px" }}
            />
            <ul>
              <li>Players are dealt 3 cards each.</li>
              <li>A trump suit (Brisca) is revealed.</li>
              <li>Play one card per turn; highest card wins the trick.</li>
              <li>Winner draws a new card (if cards remain).</li>
            </ul>
          </div>
          <p><strong>Winning:</strong> Highest score from captured cards wins. </p>
        </div>
      </div>
    </div>
  );
};

export default HelpRules;
