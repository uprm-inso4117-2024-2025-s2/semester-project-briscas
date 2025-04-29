import React, { useState, useEffect, useRef } from "react";
import "../styles/pages/GameBoard.css";
import backgroundImg from "../assets/briscas3.jpg";
import briscasColimg from "/assets/briscas.jpg";
import { Link } from "react-router-dom";
import Card from "../../../../visual_elements/VisualElements.js";
import axios from "axios";
const GameBoard = () => {
    var player1Hand = [new Card("Copas", "11"), new Card("Bastos", "7"), new Card("Bastos","12")]; 
    var player2Hand = [new Card("Copas", "12"), new Card("Bastos", "3"), new Card("Copas","4")];
    var drawCard = [new Card("Bastos","11"),new Card("Copas", "3"),new Card("Bastos", "2"), new Card("Copas", "7"), new Card("Bastos","6"), new Card("Copas","5")]; // Initialization code to have placeholder states before being retrieved from the back end.
    var gameMode = {
        "gameMode": "1p"
      } // Initialize gamemode assigned to website via JSON with string (possibly temporary, can be manipulated for dyanmic player/bot counts).
      var data = {
        "data": [player1Hand, player2Hand, drawCard, new Card("Bastos","11"), null] // Current array inside a JSON used to transfer data between front-end and back-end, can be filled with more data as needed.
      }  
      const[array, setArray] = useState([]);
      const getGamestate = async () => {
        await axios.get("http://localhost:3000/data")
          const response = await axios.get("http://localhost:3000/data") // Preparations to establish communication with back end.
          setArray(response.data.data);
          console.log(response.data.data);
          player1Hand = response.data.data[0]
          player2Hand = response.data.data[1]
          drawCard = response.data.data[2] // Retrieves data from back-end and stores it
          try {
            setPlayer1Card(player1Hand);
            setPlayer2Card(player2Hand);
            setDrawPileCard(drawCard);
            setDiscardPileCard([response.data.data[3]]);
            setTrumpCard([new Card("Copas","1")]);
        } catch (error) {
            console.error("Error initializing player hand:", error); // Initialization code to display the results in the front end (was written by someone else and moved to here for the sake of organization).
        }

      };
      const playCard = async () => {
          const write = await axios.post("http://localhost:3000/playerPlayCard", data)
           // Currently retuns data stored in the front end to the back end, is to be expanded to be used to feed input to the back end.
      };
      const playCardai = async () => {
          const write = await axios.post("http://localhost:3000/playerPlayCardai", data)
           // Currently retuns data stored in the front end to the back end, is to be expanded to be used to feed input to the back end.
      };
      const postGameMode = async () => {
        const write = await axios.post("http://localhost:3000/gameMode", gameMode) // Instance of feeding input to the back end, initializes game with correct number of players and bots including their hands.
        console.log(write.data.gameMode);
      };
      useEffect(() => {
        postGameMode();
        getGamestate(); // Procedure run on load, used to porperly initialize game and display cards (which currently seem to be missing images).
        
      }, []);


    const [player1Card, setPlayer1Card] = useState<Card[]>([]);
    const [player2Card, setPlayer2Card] = useState<Card[]>([]);
    const [drawPileCard, setDrawPileCard] = useState<Card[]>([]);
    const [discardPileCard, setDiscardPileCard] = useState<Card[]>([]);
    const [trumpCard, setTrumpCard] = useState<Card[]>([]);

    const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const discardPileRef = useRef<HTMLDivElement>(null);
    const player1CardRef = useRef<HTMLDivElement>(null);
    const player2CardRef = useRef<HTMLDivElement>(null);
    const [movingCard, setMovingCard] = useState<Card | null>(null);
    const [flippingCard, setFlippingCard] = useState<Card | null>(null);
    const [flippedCard, setFlippedCard] = useState<Card | null>(null);

    const [turn, setTurn] = useState<"player1" | "player2">("player1");
    const [isFirstTurn, setIsFirstTurn] = useState<boolean>(true);
    const [p1HasDrawn, setP1HasDrawn] = useState<boolean>(true);

    const getCardImage = (suit: string, rank: string) => {
        try {
        return `../assets/cards/${suit.toLowerCase()}_${rank}.png`;
        } catch (error) {
            console.error("Error getting the card image:", error);
        }
    };

    const handleHover = (card_type: string,card:string,index: string, isHovering: boolean) => {
        const cardElement = document.getElementById(`${card_type}_${card}_${index}`);
        if (cardElement) {
            cardElement.style.transform = isHovering ? "scale(1.1)" : "scale(1)";
        }
    };

    const calculateOffset = (event: React.MouseEvent) => {
        const cardRect = (event.target as HTMLElement).getBoundingClientRect();
         if ((event.target as HTMLElement).id.includes("draw")){
            const Rect = player1CardRef.current?.getBoundingClientRect();
            if (Rect) {
                const xOffset = Rect.left + Rect.width / 2 - (cardRect.left + cardRect.width / 2);
                const yOffset = Rect.top + Rect.height / 2 - (cardRect.top + cardRect.height / 2);
                setOffset({ x: xOffset , y: yOffset });
            }
         } else {
            const Rect = discardPileRef.current?.getBoundingClientRect();
            if (Rect) {
                const xOffset = Rect.left + Rect.width / 2 - (cardRect.left + cardRect.width / 2);
                const yOffset = Rect.top + Rect.height / 2 - (cardRect.top + cardRect.height / 2);
                setOffset({ x: xOffset , y: yOffset });
            }
         }
    };

    const calculateP2Offset = (cardElement: HTMLElement) => {
        console.log(cardElement.id);
        if (cardElement.id.includes("draw")) {
            const draw = cardElement.getBoundingClientRect();
            const P2 = player2CardRef.current?.getBoundingClientRect();
            if (draw && P2) {
                const xOffset = P2.left + P2.width / 2 - (draw.left + draw.width / 2);
                const yOffset = P2.top + P2.height / 2 - (draw.top + draw.height / 2);
                setOffset({ x: xOffset , y: yOffset });
            }
        } else {
            const discard = discardPileRef.current?.getBoundingClientRect();
            const P2 = cardElement.getBoundingClientRect();
            if (P2 && discard) {
                const xOffset = discard.left + discard.width / 2 - (P2.left + P2.width / 2);
                const yOffset = discard.top + discard.height / 2 - (P2.top + P2.height / 2);
                setOffset({ x: xOffset , y: yOffset });
            }
        }
    };

    const handleDoubleClick = (card: Card, event: React.MouseEvent) => {
        if (turn !== "player1" && !isFirstTurn) return; // Prevent Player 1 from playing out of turn

//        if (!p1HasDrawn && drawPileCard.length > 0) return; // Prevent Player 1 from playing before drawing a card, if there are cards left to draw

         //Here an API post of the removed Card will be sent to the server so the backend can know which card was played
         console.log(card)
        data.data[4] = card;
         playCard();
        setMovingCard(card);
        calculateOffset(event);
    
        setTimeout(() => {
            discardPileCard.at(0)?.updateCard(card.suit, card.rank);
            // setDiscardPileCard(prevCards => [card, ...prevCards]);
        }, 400);
    
        setTimeout(() => {
            setPlayer1Card(prevCards => prevCards.filter(c => c.id !== card.id));
        }, 500);
    
        setTimeout(() => {
            setMovingCard(null);
            setOffset({ x: 0, y: 0 });    
            // Simulate AI move after Player 1 plays
            setIsFirstTurn(false); // Disable first turn exception after the first move
            setP1HasDrawn(false);
            setTurn("player2"); // Switch to Player 2's turn
            setTimeout(handlePlayer2Play, 1000); // Delay for realism
        }, 600);
    };

    const handlePlayer2Play = () => {
        if (player2Card.length === 0) {
            setTurn("player1");
            return;
        }
    
        // Pick a random card from Player 2's hand
        const randomIndex = Math.floor(Math.random() * player2Card.length);
        const aiCard = player2Card[randomIndex];
        data.data[4] = aiCard;
        playCardai();
    
        setFlippingCard(aiCard); // Start flipping animation
        setTimeout(() => {
            setFlippingCard(null);
            setFlippedCard(aiCard);
        }, 300);
        
        setTimeout(() => {
            const cardElement = document.getElementById(`player2_${aiCard.rank}_${aiCard.suit}`);
            if (cardElement) calculateP2Offset(cardElement);
            setMovingCard(aiCard);
        }, 600);

        setTimeout(() => {
            // setDiscardPileCard(prevCards => [aiCard,...prevCards]);
            discardPileCard.at(0)?.updateCard(aiCard.suit, aiCard.rank);
        }, 900);

        setTimeout(() => {
            setPlayer2Card(prevCards => prevCards.filter((_, index) => index !== randomIndex));
        }, 1200);

        setTimeout(() => {
            setMovingCard(null);
            setFlippedCard(null);
            setOffset({ x: 0, y: 0 });
        }, 1500);

        setTimeout(() => {
            handlePlayer2DrawCard();
        }, 1800);
        getGamestate();
    };

    const handleDrawCard = (event: React.MouseEvent) => {
        if (turn !== "player1" || isFirstTurn || p1HasDrawn) return; // Prevent drawing on the first turn or out of turn

        if (drawPileCard.length > 0) {
            const newCard = drawPileCard[0];

            setFlippingCard(newCard);
            setTimeout(() => {
                setFlippingCard(null);
                setFlippedCard(newCard);
            }, 300);

            setTimeout(() => {
                calculateOffset(event);
                setMovingCard(newCard);
            }, 500);

            setTimeout(() => {
                setPlayer1Card(prevCards => [...prevCards, newCard]);
                setDrawPileCard(prev => prev.slice(1));
                setMovingCard(null);
                setFlippedCard(null);
                setP1HasDrawn(true);
            }, 800);
        }
    };

    const handlePlayer2DrawCard = () => {
        if (drawPileCard.length > 0) {
            const newCard = drawPileCard[0];

            const cardElement = document.getElementById(`draw_pile_${newCard.rank}_${newCard.suit}`);
            console.log(cardElement);
            if (cardElement) calculateP2Offset(cardElement);
            setMovingCard(newCard);

            setTimeout(() => {
                setPlayer2Card(prevCards => [...prevCards, newCard]);
                setDrawPileCard(prev => prev.slice(1));
                setMovingCard(null);
                setTurn("player1"); // Switch back to Player 1's turn
            }, 400);

        } else {
            setTurn("player1");
        }
    }
    
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
        <div className="game-board">
                <div id="player1-hand">
                    <div 
                    className="card player1-hand"
                    ref={player1CardRef}        >
                        {player1Card.map((card, index) => (
                            card.suit !== "null" ? ( // If there's a card, display it
                                <img
                                    key={card.id}
                                    id={`player1_${card.rank}_${card.suit}`}
                                    src={getCardImage(card.suit, card.rank)}
                                    alt={`Card ${card.rank} of ${card.suit}`}
                                    onMouseEnter={() => handleHover("player1", card.rank, card.suit, true)}
                                    onMouseLeave={() => handleHover("player1", card.rank, card.suit, false)}
                                    className={`clickable-card ${movingCard === card ? "moving" : ""}`}
                                    onDoubleClick={(e) => handleDoubleClick(card, e)}
                                    style={
                                        movingCard === card
                                            ? { transform: `translate(${offset.x}px, ${-300}px)` }
                                            : {}
                                    }
                                />
                            ) : (
                                // Render an empty placeholder
                                <img 
                                    src={"../assets/empty_card.png"}
                                    className={"card placeholder"}
                                />
                            )
                        ))}
                        <p></p>
                    </div>
                </div>
                <div 
                    className="card player2-hand"
                    ref={player2CardRef}        >
                    {player2Card.map((card, index) => (
                        <img
                            key={card.id}
                            id={`player2_${card.rank}_${card.suit}`}
                            src={flippedCard === card ? getCardImage(card.suit, card.rank) : "../assets/back.png"}
                            alt={`Card ${card.rank} of ${card.suit}`}
                            className={`non-clickable-card ${flippingCard === card ? "flipping" : ""} ${movingCard === card ? "moving" : ""}`}
                            style={
                                movingCard === card
                                    ? { transform: `translate(${offset.x}px, ${offset.y}px)` }
                                    : {}
                            }
                        />
                    ))}
                    <p></p>
                </div>
                <div className="card trump-card">
                    {trumpCard.map((card, index) => (
                        <img
                            key={card.id}
                            id={`${card.rank}_${card.suit}`}
                            src={getCardImage(card.suit, card.rank)}
                            alt={`Card ${card.rank} of ${card.suit}`}
                        />
                    ))}
                    <p></p>
                </div>
                <div className="card draw-pile">
                    {drawPileCard.map((card, index) => (
                        <img
                            key={card.id}
                            src={flippedCard === card ? getCardImage(card.suit, card.rank) : "../assets/back.png"}
                            alt={`Card ${card.rank} of ${card.suit}`}
                            id={`draw_pile_${card.rank}_${card.suit}`}
                            onMouseEnter={() => handleHover("draw_pile",card.rank,card.suit, true)}
                            onMouseLeave={() => handleHover("draw_pile",card.rank,card.suit, false)}
                            className={`card ${flippingCard === card ? "flipping" : ""} ${movingCard === card ? "moving" : ""} ${index === 0 ? "top-card" : ""}`}
                            onDoubleClick={(e) => handleDrawCard(e)}
                            style={
                                movingCard === card
                                    ? { transform: `translate(${offset.x}px, ${offset.y}px)` }
                                    : {}
                            }
                        />
                    ))}
                    <p></p>
                </div>
                <div 
                    className="card discard-pile"
                    ref={discardPileRef}                >
                    {discardPileCard.map((card, index) => (
                        card.suit !== "null" ?(
                        <img
                            key={card.id}
                            src={getCardImage(card.suit, card.rank)}
                            alt={`Card ${card.rank} of ${card.suit}`}
                            className={`card discard-card" ${index === 0 ? "top-card" : ""}`}
                            
                        />
                        ) : (
                            <img 
                                    src={"../assets/empty_card.png"}
                                    className={"card placeholder"}
                                />
                        )
                    ))}
                    <p></p>
                </div>
            </div>
        </div>
    );
  };
  
  export default GameBoard;

