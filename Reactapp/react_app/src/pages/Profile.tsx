import { useState, useEffect } from "react";
import "../styles/pages/Profile_Page.css";
import Navbar from "../components/Navbar";

const Profile = () => {
  // State to store user input
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Controls edit mode
  const [isClicked, setIsClicked] = useState(""); // Tracks clicked button

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedEmail = localStorage.getItem("email");

    if (savedUsername) setUsername(savedUsername);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  // Enable editing when "EDIT PROFILE" is clicked
  const handleEdit = () => {
    setIsEditing(true);
    setIsClicked("edit");
    setTimeout(() => setIsClicked(""), 200); // Remove effect after 200ms
  };

  // Handle form update and save to localStorage
  const handleUpdate = () => {
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);

    // Set notification message
    setNotification("Changes saved successfully!");

    // Disable editing after saving
    setIsEditing(false);

    // Click effect
    setIsClicked("update");
    setTimeout(() => setIsClicked(""), 200);

    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  return (
    <div className="profile-page">
      <div className="background-image"></div>
      <div className="content">
        <Navbar />

        <div className="profile-container">
          <div className="profile-section">
            <div className="profile-icon">
              <i className="fa fa-user"></i>
            </div>

            {/* Edit Profile Button */}
            <button 
              className={`edit-profile-button ${isClicked === "edit" ? "clicked" : ""}`} 
              onClick={handleEdit}
            >
              EDIT PROFILE
            </button>

            {/* User fields */}
            <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
              <label>USERNAME</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="USERNAME" 
                disabled={!isEditing} // Disabled unless editing
              />

              <label>EMAIL</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="EMAIL" 
                disabled={!isEditing} // Disabled unless editing
              />

              <label>PASSWORD</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="PASSWORD" 
                disabled={!isEditing} // Disabled unless editing
              />

              {/* Update Button */}
              <button 
                type="button" 
                className={`update-button ${isClicked === "update" ? "clicked" : ""}`} 
                onClick={handleUpdate}
                disabled={!isEditing} // Prevents clicking "UPDATE" before editing
              >
                UPDATE
              </button>

              {/* Notification */}
              {notification && <p className="notification">{notification}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
