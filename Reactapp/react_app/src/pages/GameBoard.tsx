import React, { useState, useEffect } from "react";
import "../styles/pages/GameBoard.css";
import backgroundImg from "../assets/briscas3.jpg";
import briscasColimg from "../assets/background1.jpg";
import Card from "../../../../visual_elements/VisualElements.js";

const GameBoard = () => {
    const [drawPileCard, setDrawPileCard] = useState<Card[]>([]);
    const [discardPileCard, setDiscardPileCard] = useState<Card[]>([]);

    useEffect(() => {
        try {
            const drawCard = [new Card("Copas", "1")];  // Example draw pile card
            const discardCard = [new Card("Copas", "4")];  // Example discard pile card

            setDrawPileCard(drawCard);
            setDiscardPileCard(discardCard);
        } catch (error) {
            console.error("Error initializing player hand:", error);
        }
    }, []);

    const getCardImage = (suit: string, rank: string) => {
        try {
        return `../assets/${suit.toLowerCase()}_${rank}.png`;
        } catch (error) {
            console.error("Error getting the card image:", error);
        }
    };
    return (
        <div className="body">
            <img id="backgroundimg" src={backgroundImg} />
            <img id="briscasColimg" src={briscasColimg} />

            <div id="buttons1">
                <div className="buttonPadding"><div className="text">Main Menu</div></div>
                <div className="buttonPadding"><div className="text">Settings</div></div>
            </div>
            <div id="buttons2">
                <div className="buttonPadding"><div className="text">Pause Game</div></div>
                <div className="buttonPadding"><div className="text">New Game</div></div>
                <div className="buttonPadding"><div className="text">Exit Game</div></div>
            </div>

            <div className="game-board">
                <div className="card draw-pile">
                    {drawPileCard.map((card, index) => (
                        <img
                            key={index}
                            src={getCardImage(card.suit, card.rank)}
                            alt={`Card ${card.rank} of ${card.suit}`}
                        />
                    ))}
                    <p>Draw Pile</p>
                </div>
                <div className="card discard-pile">
                    {discardPileCard.map((card, index) => (
                        <img
                            key={index}
                            src={getCardImage(card.suit, card.rank)}
                            alt={`Card ${card.rank} of ${card.suit}`}
                        />
                    ))}
                    <p>Discard Pile</p>
                </div>
            </div>
        </div>
    );
};

export default GameBoard;
