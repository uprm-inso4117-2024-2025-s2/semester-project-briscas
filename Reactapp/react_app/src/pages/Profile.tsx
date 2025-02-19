import "../styles/pages/Profile_Page.css";
import Navbar from "../components/Navbar";

const Profile = () => {
  return (
    <div className="profile-page">
      <div className="background-image"></div>
      <div className="content">
        <Navbar />

        <div className="profile-container">
          <div className="profile-section">
            <div className="profile-icon">
            {/*profile icon imported from Font Awesome*/}
              <i className="fa fa-user"></i>
            </div>
            <button className="edit-profile-button">EDIT PROFILE</button>

            {/* User fields */}
            <form className="profile-form">
              <label>USERNAME</label>
              <input type="text" placeholder="USERNAME" />

              <label>EMAIL</label>
              <input type="email" placeholder="EMAIL" />

              <label>PASSWORD</label>
              <input type="password" placeholder="PASSWORD" />

              <button type="button" className="update-button">UPDATE</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
