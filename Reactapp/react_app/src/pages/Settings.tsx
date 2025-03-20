import React, { useState } from "react";
import "../styles/pages/Settings_Page.css";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Settings = () => {
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(50);
  const [sfxVolume, setSfxVolume] = useState(50);

  return (
    <div className="settings-page">
      <Navbar />
      <div className="settings-container">
        <h2 className="settings-title">Settings</h2>

        {/* Music Toggle and Slider */}
        <div className="settings-row">
          <div className="setting-item">
            <label>Music</label>
            <div className="toggle-container">
              <button
                className={`toggle-button ${!musicEnabled ? "active" : ""}`}
                onClick={() => setMusicEnabled(false)}
              >
                OFF
              </button>
              <button
                className={`toggle-button ${musicEnabled ? "active" : ""}`}
                onClick={() => setMusicEnabled(true)}
              >
                ON
              </button>
            </div>
          </div>

          <div className="setting-item">
            <label>Music Volume</label>
            <div className="slider-container">
              <input
                type="range"
                min="0"
                max="100"
                value={musicVolume}
                onChange={(e) => setMusicVolume(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Sound Effects Toggle and Slider */}
        <div className="settings-row">
          <div className="setting-item">
            <label>Sound Effects</label>
            <div className="toggle-container">
              <button
                className={`toggle-button ${!sfxEnabled ? "active" : ""}`}
                onClick={() => setSfxEnabled(false)}
              >
                OFF
              </button>
              <button
                className={`toggle-button ${sfxEnabled ? "active" : ""}`}
                onClick={() => setSfxEnabled(true)}
              >
                ON
              </button>
            </div>
          </div>

          <div className="setting-item">
            <label>Sound Effects Volume</label>
            <div className="slider-container">
              <input
                type="range"
                min="0"
                max="100"
                value={sfxVolume}
                onChange={(e) => setSfxVolume(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-buttons">
          <button className="apply-button">Apply</button>
          <button className="cancel-button">Cancel</button>
          <Link to="/">
            <button className="exit-button">Exit</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Settings;
