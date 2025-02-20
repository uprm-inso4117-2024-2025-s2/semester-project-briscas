import Navbar from "../components/Navbar";
import "../styles/pages/Settings.css"
import briscasColimg2 from "../assets/briscas.jpg";
import { useState } from "react";

const Settings = () => {
  const [musicVolume, setMusicVolume] = useState(50);
  const [soundEffectsVolume, setSoundEffectsVolume] = useState(50);
  return (
    <div className="head">
      <Navbar/>
      <div className="body">
        <div className="imgContainer">
          <img id="briscasColimg2" src={briscasColimg2}/>
          <div className="fader"></div>
          <p className="text" id="music">Music</p>
          <p className="text" id="soundeffects">Sound Effects</p>
          <p className="text" id="musicvolume">Music Volume</p>
          <p className="text" id="soundeffectsvolume">Sound Effects Volume</p>

          <label className="toggle-container" id="container1">
            <input type="checkbox" className="toggle-input"/>
            <span className="toggle-slider">
              <p className="on">ON</p>
              <p className="off">OFF</p>
            </span>
          </label>

          <label className="toggle-container" id="container2">
            <input type="checkbox" className="toggle-input"/>
            <span className="toggle-slider">
              <p className="on">ON</p>
              <p className="off">OFF</p>
            </span>
          </label>

          <div className="volume-control" id="control1">
            <input
              id="musicVolume"
              type="range"
              min="0"
              max="100"
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseInt(e.target.value, 10))}
              className="volume-slider"
              step="1"
            />
            <span id="volumeValue">{musicVolume}</span>
          </div>

          <div className="volume-control" id="control2">
            <input
              id="soundEffectsVolume"
              type="range"
              min="0"
              max="100"
              value={soundEffectsVolume}
              onChange={(e) => setSoundEffectsVolume(parseInt(e.target.value, 10))}
              className="volume-slider"
              step="1"
            />
            <span id="soundVolumeValue">{soundEffectsVolume}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
