import "../styles/pages/Home_Page.css"
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="homepage">
      <div className="homepage-content">
        <Navbar/>
        <h1>Briscas</h1>
        <Link to="/GameBoard"><button className="start-button">Start Game</button></Link>
      </div>
    </div>
  );
};

export default Home;
