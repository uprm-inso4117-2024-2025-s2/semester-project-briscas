import React, { useState } from "react";
import "../styles/pages/Settings_Page.css";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Settings = () => {
  // Default values
  const DEFAULT_MUSIC_ENABLED = true;
  const DEFAULT_SFX_ENABLED = true;
  const DEFAULT_MUSIC_VOLUME = 50;
  const DEFAULT_SFX_VOLUME = 50;

  // // State variables
  // const [musicEnabled, setMusicEnabled] = useState(DEFAULT_MUSIC_ENABLED);
  // const [sfxEnabled, setSfxEnabled] = useState(DEFAULT_SFX_ENABLED);
  // const [musicVolume, setMusicVolume] = useState(DEFAULT_MUSIC_VOLUME);
  // const [sfxVolume, setSfxVolume] = useState(DEFAULT_SFX_VOLUME);

    // Load saved settings or use defaults
    const [musicEnabled, setMusicEnabled] = useState<boolean>(() => {
      return JSON.parse(localStorage.getItem("musicEnabled") || "true");
    });
  
    const [sfxEnabled, setSfxEnabled] = useState<boolean>(() => {
      return JSON.parse(localStorage.getItem("sfxEnabled") || "true");
    });
  
    const [musicVolume, setMusicVolume] = useState<number>(() => {
      return JSON.parse(localStorage.getItem("musicVolume") || "50");
    });
  
    const [sfxVolume, setSfxVolume] = useState<number>(() => {
      return JSON.parse(localStorage.getItem("sfxVolume") || "50");
    });
  
    // Save settings to localStorage when Apply button is clicked
    const saveSettings = () => {
      localStorage.setItem("musicEnabled", JSON.stringify(musicEnabled));
      localStorage.setItem("sfxEnabled", JSON.stringify(sfxEnabled));
      localStorage.setItem("musicVolume", JSON.stringify(musicVolume));
      localStorage.setItem("sfxVolume", JSON.stringify(sfxVolume));
      alert("Settings saved successfully!");
    };

  // Reset function for Cancel button
  const resetSettings = () => {
    setMusicEnabled(DEFAULT_MUSIC_ENABLED);
    setSfxEnabled(DEFAULT_SFX_ENABLED);
    setMusicVolume(DEFAULT_MUSIC_VOLUME);
    setSfxVolume(DEFAULT_SFX_VOLUME);
  };

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
          <button className="apply-button" onClick={saveSettings}>Apply</button>
          <button className="cancel-button" onClick={resetSettings}>Reset</button>
          <Link to="/">
            <button className="exit-button">Exit</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Settings;
