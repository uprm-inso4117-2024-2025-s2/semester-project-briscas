import "../styles/pages/GameBoard.css"
import backgroundImg from "../assets/briscas3.jpg";
import briscasColimg from "/assets/briscas.jpg";
import { Link } from "react-router-dom";

const GameBoard = () => {
    return (
    <div className="body">
        <img id="backgroundimg" src={backgroundImg}/>
        <img id="briscasColimg" src={briscasColimg}/>

        <div id="upperButtons">
            <div className="ButtonsContainer">
                <Link to='/'><button className = "buttons"> Main Menu</button> </Link>
                <Link to='/Settings'><button className = "buttons"> Settings</button> </Link>
            </div>
        </div>

        <div id="lowerButtons">
            <div className="ButtonsContainer">
                <button className = "buttons"> Pause Game</button> 
                <button className = "buttons"> New Game</button> 
                <button className = "buttons"> Exit Game</button> 
            </div>
        </div>
    </div>
    );
  };
  
  export default GameBoard;
