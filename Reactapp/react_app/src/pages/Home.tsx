import "../styles/pages/Home_Page.css"
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";


const Home = () => {
  return (
    <div className="homepage">
      <div className="homepage-content">
        <Navbar/>

        <p className="briscas-title">Briscas</p>
          <select className="select-players-button">
            <option value="" hidden>Select Players</option>
            <option value="1">1 Player</option>
          </select>
        <Link to="/GameBoard"><button className="play-button">&#9658; Play</button></Link>
      </div>
    </div>
  );
};

export default Home;
