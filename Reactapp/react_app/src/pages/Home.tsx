import "../styles/pages/Home_Page.css"
import Navbar from "../components/Navbar";
const Home = () => {
  return (
    <div className="homepage">
      <div className="homepage-content">
        <Navbar/>
        <h1>Briscas</h1>
        <button className="start-button">Start Game</button>
      </div>
    </div>
  );
};

export default Home;
