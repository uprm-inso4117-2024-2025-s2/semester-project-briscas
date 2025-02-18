import "../styles/pages/GameBoard.css"
import backgroundImg from "../assets/briscas3.jpg";
import briscasColimg from "../assets/briscas.jpg";

const GameBoard = () => {
    return (
    <div className="body">
        <img id="backgroundimg" src={backgroundImg}/>
        <img id="briscasColimg" src={briscasColimg}/>
        <div id="buttons1">
            <div className="buttonPadding">
                <div className="text"> Main Menu </div>
            </div>
            <div className="buttonPadding">
                <div className="text"> Settings </div>
            </div>
        </div>
        <div id="buttons2">
            <div className="buttonPadding">
                <div className="text"> Pause Game </div>
            </div>
            <div className="buttonPadding">
                <div className="text"> New Game </div>
            </div>
            <div className="buttonPadding">
                <div className="text"> Exit Game </div>
            </div>
        </div>
    </div>
    );
  };
  
  export default GameBoard;