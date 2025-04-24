import React, { useState, useEffect, useRef } from "react";
import "../styles/pages/GameBoard.css";
import backgroundImg from "../assets/briscas3.jpg";
import briscasColimg from "/assets/briscas.jpg";
import { Link } from "react-router-dom";
import Card from "../../../../visual_elements/VisualElements.js";
import axios from "axios";
import GameConsole from "../components/GameConsole";
import socket from "../network/socketClient";

const GameBoard = () => {
    const [debugOpen, setDebugOpen] = useState(false);
    const hasInitialized = useRef(false);
    const [currentTurn, setCurrentTurn] = useState<"1" | "2">("1");
    const [player1PlayedCard, setPlayer1PlayedCard] = useState<Card | null>(null);
    const [player2PlayedCard, setPlayer2PlayedCard] = useState<Card | null>(null);
    const [roundWinner, setRoundWinner] = useState<string | null>(null)
    const [isRoundResolving, setIsRoundResolving] = useState(false);
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    const columnRef = useRef<HTMLImageElement>(null);
    const [columnCenter, setColumnCenter] = useState<number>(60); // fallback center
    const [player1OffsetX, setPlayer1OffsetX] = useState(0);
    const player1HandRef = useRef<HTMLDivElement>(null);
    const player2HandRef = useRef<HTMLDivElement>(null);
    const [player2OffsetX, setPlayer2OffsetX] = useState(0);

    const discardPileRef = useRef<HTMLDivElement>(null);
    const [discardOffsetX, setDiscardOffsetX] = useState(0);
    const [drawOffsetX, setDrawOffsetX] = useState(0);
    const [trumpOffsetX, setTrumpOffsetX] = useState(0);
    const [bannerOffsetX, setBannerOffsetX] = useState(0);
    const [aiHasPlayed, setAiHasPlayed] = useState(false);
    const [roundStarter, setRoundStarter] = useState<"1" | "2">("1");
        
    const [player1Card, setPlayer1Card] = useState<Card[]>([]);
    const [player2Card, setPlayer2Card] = useState<Card[]>([]);
    const [drawPileCard, setDrawPileCard] = useState<Card[]>([]);
    const [discardPileCard, setDiscardPileCard] = useState<Card[]>([]);
    const [trumpCard, setTrumpCard] = useState<Card[]>([]);

    const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const player1CardRef = useRef<HTMLDivElement>(null);
    const player2CardRef = useRef<HTMLDivElement>(null);
    const [movingCard, setMovingCard] = useState<Card | null>(null);
    const [flippingCard, setFlippingCard] = useState<Card | null>(null);
    const [flippedCard, setFlippedCard] = useState<Card | null>(null);

    const [isFirstTurn, setIsFirstTurn] = useState<boolean>(true);
    const [p1HasDrawn, setP1HasDrawn] = useState<boolean>(true);

    var player1Hand = [new Card("Copas", "11"), new Card("Bastos", "7"), new Card("Bastos","12")]; 
    var player2Hand = [new Card("Copas", "12"), new Card("Bastos", "3"), new Card("Copas","4")];
    var drawCard = [new Card("Bastos","11"),new Card("Copas", "3"),new Card("Bastos", "2"), new Card("Copas", "7"), new Card("Bastos","6"), new Card("Copas","5")]; // Initialization code to have placeholder states before being retrieved from the back end.
    var gameMode = {
        "gameMode": "1p"
      } // Initialize gamemode assigned to website via JSON with string (possibly temporary, can be manipulated for dyanmic player/bot counts).
    var data = {
        "data": [player1Hand, player2Hand, drawCard] // Current array inside a JSON used to transfer data between front-end and back-end, can be filled with more data as needed.
    }
    const[array, setArray] = useState([]);
    const getGamestate = async () => {
        try {
        const response = await axios.get("http://localhost:3000/data");
        setArray(response.data.data);
    
        const player1Hand = response.data.data[0];
        const player2Hand = response.data.data[1];
        const drawCard = response.data.data[2];
        const trump = response.data.data[3];
        const currentTurn = response.data.turn;

    
        setPlayer1Card(player1Hand);
        setPlayer2Card(player2Hand);
        setDrawPileCard(drawCard);
        setDiscardPileCard([]);
        setTrumpCard([trump]);
        setCurrentTurn(currentTurn);
    
          // Debug terminal logs
        console.log("[DATA] Game state received from backend");
        console.log("  Player 1 hand:", player1Hand.map((c: any) => `${c.rank} of ${c.suit}`).join(", "));
        console.log("  Player 2 hand:", player2Hand.map((c: any) => `${c.rank} of ${c.suit}`).join(", "));
        console.log("  Trump card:", trump?.rank, "of", trump?.suit);
    
        } catch (error) {
        console.error("[ERROR] Failed to initialize game state:", error);
        }
    };
    
    const postGameMode = async () => {
        const write = await axios.post("http://localhost:3000/gameMode", gameMode) // Instance of feeding input to the back end, initializes game with correct number of players and bots including their hands.
        console.log(`[MODE] Game mode set to: ${write.data.gameMode}`);

    };

    useEffect(() => {
        const updateBannerOffset = () => {
        const spaceRight = window.innerWidth - columnCenter;
        const centerX = columnCenter + spaceRight / 2;
        setBannerOffsetX(centerX);
        };
    
        updateBannerOffset();
        window.addEventListener("resize", updateBannerOffset);
        return () => window.removeEventListener("resize", updateBannerOffset);
    }, [columnCenter]);

    useEffect(() => {
        const updatePileOffsets = () => {
        const spaceRight = window.innerWidth - columnCenter;
        const discardCenterX = columnCenter + spaceRight / 2;
    
        const spacing = 120;               // Horizontal spacing between piles
        const trumpVisualOffset = 100;      // Extra left offset for rotated trump card
    
        setDiscardOffsetX(discardCenterX);
        setDrawOffsetX(discardCenterX + spacing);
        setTrumpOffsetX(discardCenterX - spacing - trumpVisualOffset);
        };
    
        updatePileOffsets(); // initial run
        window.addEventListener("resize", updatePileOffsets);
        return () => window.removeEventListener("resize", updatePileOffsets);
    }, [columnCenter]);
    
    

    useEffect(() => {
        const updateCenter = () => {
        const col = columnRef.current;
        if (col) {
            const rect = col.getBoundingClientRect();
            const centerX = rect.width / 2 + rect.left;
            setColumnCenter(centerX);
        }
        };
    
        // Trigger once right away
        updateCenter();
    
        // Run on resize
        window.addEventListener("resize", updateCenter);
    
        // ALSO wait for briscasColimg to load (in case it's not ready yet)
        const img = document.getElementById("briscasColimg") as HTMLImageElement;
    
        if (img?.complete) {
          updateCenter(); // already loaded, safe to update
        } else {
        img?.addEventListener("load", updateCenter);
        }
    
        // Cleanup
        return () => {
        window.removeEventListener("resize", updateCenter);
        img?.removeEventListener("load", updateCenter);
        };
    }, []);

    useEffect(() => {
        if (!hasInitialized.current) {
            postGameMode();
            getGamestate(); // Procedure run on load, used to porperly initialize game and display cards (which currently seem to be missing images).
            hasInitialized.current = true;
        }
    }, []);
    useEffect(() => {
        socket.on("connect", () => {
        console.log(`[SOCKET] Connected to server with ID: ${socket.id}`);
        });
    
        socket.on("disconnect", () => {
        console.log("[SOCKET] Disconnected from server");
        });
    
        socket.on("sessionJoined", ({ payload }) => {
        console.log(`[SESSION] Joined session: ${payload.sessionId} as player ${payload.playerId}`);
        });
    
        socket.on("gameResumed", ({ message }) => {
        console.log(`[GAME] ${message}`);
        });
    
        socket.on("gamePaused", ({ reason }) => {
        console.log(`[GAME] Paused due to: ${reason}`);
        });
    
        return () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("sessionJoined");
        socket.off("gameResumed");
        socket.off("gamePaused");
        };
    }, []); // 👈 runs once on mount
    useEffect(() => {
        if (player1PlayedCard && player2PlayedCard) {
        resolveRound();
        }
    }, [player1PlayedCard, player2PlayedCard]);

    useEffect(() => {
        const updateHandOffset = () => {
        if (player1HandRef.current) {
            const handRect = player1HandRef.current.getBoundingClientRect();
            const spaceRight = window.innerWidth - columnCenter;
            const offset = columnCenter + (spaceRight - handRect.width) / 2;
            setPlayer1OffsetX(offset);
        }
        };
    
        updateHandOffset();
        window.addEventListener("resize", updateHandOffset);
    
        return () => window.removeEventListener("resize", updateHandOffset);
    }, [columnCenter]);

    useEffect(() => {
        const updatePlayer2Offset = () => {
        if (player2HandRef.current) {
            const handRect = player2HandRef.current.getBoundingClientRect();
            const spaceRight = window.innerWidth - columnCenter;
            const offset = columnCenter + (spaceRight - handRect.width) / 2;
            setPlayer2OffsetX(offset);
        }
        };
    
        updatePlayer2Offset();
        window.addEventListener("resize", updatePlayer2Offset);
        return () => window.removeEventListener("resize", updatePlayer2Offset);
    }, [columnCenter]);

    useEffect(() => {
        if (currentTurn === "2" && player2Card.length > 0 && !aiHasPlayed) {
        console.log("[TURN] AI's turn — playing a card...");
        setAiHasPlayed(true);
        handlePlayer2Play();
        }
    }, [currentTurn, player2Card, aiHasPlayed]);

    useEffect(() => {
        if (currentTurn === "1") {
          setAiHasPlayed(false); // 🔄 Allow AI to play again on next turn
        }
    }, [currentTurn]);

    useEffect(() => {
        if (!isRoundResolving) {
        setAiHasPlayed(false);
        }
    }, [isRoundResolving]);

    useEffect(() => {
        if (
        player1PlayedCard &&
        !player2PlayedCard &&
        currentTurn === "1" &&
        !isRoundResolving
        ) {
        console.log("[TURN] Player 1 has played — switching to Player 2");
        setCurrentTurn("2");
        }
    
        if (
        player2PlayedCard &&
        !player1PlayedCard &&
        currentTurn === "2" &&
        !isRoundResolving
        ) {
        console.log("[TURN] Player 2 has played — switching to Player 1");
        setCurrentTurn("1");
        }
    }, [player1PlayedCard, player2PlayedCard, currentTurn, isRoundResolving]);
    

    const resolveRound = () => {
        setIsRoundResolving(true);

        const winner = determineWinner(player1PlayedCard!, player2PlayedCard!, trumpCard[0], roundStarter);
        const roundPoints = player1PlayedCard!.points + player2PlayedCard!.points;

        setRoundStarter(winner); // Save who should go first in next round

        console.log(`[ROUND] Player 1 played: ${player1PlayedCard!.rank} of ${player1PlayedCard!.suit}`);
        console.log(`[ROUND] Player 2 played: ${player2PlayedCard!.rank} of ${player2PlayedCard!.suit}`);
        console.log(`[ROUND] Player ${winner} wins the round`);

        // Safely copy and draw from deck
        const updatedDeck = [...drawPileCard];
        const firstCard = updatedDeck.shift();
        const secondCard = updatedDeck.shift();

        if (!firstCard || !secondCard) {
            console.warn("[DRAW] Not enough cards in the deck to continue drawing.");
            return;
        }

        // Update the deck state immediately
        setDrawPileCard(updatedDeck); 

        if (winner === "1") {
            setPlayer1Score(prev => prev + roundPoints);
            console.log(`[ROUND] Round value: ${roundPoints} points`);
            console.log(`[SCORE] Player 1: ${player1Score + roundPoints} points`);
            console.log(`[SCORE] Player 2: ${player2Score} points`);
            console.log(`[DRAW] Player 1 drew: ${firstCard.rank} of ${firstCard.suit}`);
            handlePlayer1DrawCard(firstCard);

            setTimeout(() => {
                console.log(`[DRAW] Player 2 drew: ${secondCard.rank} of ${secondCard.suit}`);
                handlePlayer2DrawCard(secondCard);
            }, 500);
        } else {
            setPlayer2Score(prev => prev + roundPoints);
            console.log(`[ROUND] Round value: ${roundPoints} points`);
            console.log(`[SCORE] Player 1: ${player1Score} points`);
            console.log(`[SCORE] Player 2: ${player2Score + roundPoints} points`);
            console.log(`[DRAW] Player 2 drew: ${firstCard.rank} of ${firstCard.suit}`);
            handlePlayer2DrawCard(firstCard);

            setTimeout(() => {
                console.log(`[DRAW] Player 1 drew: ${secondCard.rank} of ${secondCard.suit}`);
                handlePlayer1DrawCard(secondCard);
            }, 500);
        }

        setTimeout(() => {
            setCurrentTurn(winner);
            console.log(`[TURN] Round restarts with Player ${winner}`);
        }, 600);

        // Show winner banner
        setRoundWinner(`Player ${winner}`);
        setTimeout(() => {
            setRoundWinner(null);
            setIsRoundResolving(false)
        }, 3500);

        // 💥 Clear discard pile
        setTimeout(() => {
            setDiscardPileCard([]);
          }, 1000); // ⏱️ 1 second delay (1000ms)

        // Clear state for next round
        setPlayer1PlayedCard(null);
        setPlayer2PlayedCard(null);
    };

    const briscaStrength: Record<string, number> = {
        "1": 10,
        "3": 9,
        "12": 8,
        "11": 7,
        "10": 6,
        "7": 5,
        "6": 4,
        "5": 3,
        "4": 2,
        "2": 1,
    };
    
    const determineWinner = (
        card1: Card,
        card2: Card,
        trump: Card,
        starter: "1" | "2"
    ): "1" | "2" => {
        const strength1 = briscaStrength[card1.rank] ?? 0;
        const strength2 = briscaStrength[card2.rank] ?? 0;
    
        const firstCard = starter === "1" ? card1 : card2;
        const secondCard = starter === "1" ? card2 : card1;
    
        const firstStrength = starter === "1" ? strength1 : strength2;
        const secondStrength = starter === "1" ? strength2 : strength1;
    
        const isFirstTrump = firstCard.suit === trump.suit;
        const isSecondTrump = secondCard.suit === trump.suit;
    
        // 1. If second card is trump and first is not → second wins
        if (isSecondTrump && !isFirstTrump) return starter === "1" ? "2" : "1";
    
        // 2. If both same suit → higher Brisca strength wins
        if (firstCard.suit === secondCard.suit) {
            return firstStrength >= secondStrength ? starter : starter === "1" ? "2" : "1";
        }
    
        // 3. If suits differ, and second is not trump → first wins
        return starter;
    };
    

const getCardImage = (suit: string, rank: string) => {
    try {
        const suitMap: Record<string, string> = {
        "Oros": "Oro",
        "Copas": "Copa",
        "Espadas": "Espada",
        "Bastos": "Basto"
        };
    
        const folder = suitMap[suit] || suit; // fallback if unmapped
        return `/assets/cards/${folder}/${folder.toLowerCase()}${rank}.png`;
    } catch (error) {
        console.error("Error getting the card image:", error);
        return "/assets/empty_card.png"; // fallback image
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
        console.log("Clicked a card:");
        console.log("  currentTurn:", currentTurn);
        console.log("  isFirstTurn:", isFirstTurn);
        console.log("  p1HasDrawn:", p1HasDrawn);
        if (isRoundResolving) {
            console.log("[BLOCK] Cannot play during round resolution.");
            return;
        }
    
        if (currentTurn !== "1" && !isFirstTurn) return;
        if (!p1HasDrawn && drawPileCard.length > 0) return;
         //Here an API post of the removed Card will be sent to the server so the backend can know which card was played

        setMovingCard(card);
        calculateOffset(event);
    
        setTimeout(() => {
            setDiscardPileCard([card]);
            setPlayer1PlayedCard(card);
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
        }, 600);
    };

    const handlePlayer2Play = () => {
        // Pick a random card from Player 2's hand
        const randomIndex = Math.floor(Math.random() * player2Card.length);
        const aiCard = player2Card[randomIndex];
    
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
            setDiscardPileCard([aiCard]);
            setPlayer2PlayedCard(aiCard);
        }, 900);

        setTimeout(() => {
            setPlayer2Card(prevCards => prevCards.filter((_, index) => index !== randomIndex));
        }, 1200);

        setTimeout(() => {
            setMovingCard(null);
            setFlippedCard(null);
            setOffset({ x: 0, y: 0 });
        }, 1500);
    };

    const handlePlayer1DrawCard = (card: Card) => {      
        setFlippingCard(card);
        
        setTimeout(() => {
            setFlippingCard(null);
            setFlippedCard(card);
        }, 300);
        
        setTimeout(() => {
            setMovingCard(card);
        }, 500);
        
        setTimeout(() => {
            setPlayer1Card(prevCards => [...prevCards, card]);
            setMovingCard(null);
            setFlippedCard(null);
            setP1HasDrawn(true);
        }, 800);
    };

    const handlePlayer2DrawCard = (card: Card) => {
        const cardElement = document.getElementById(`draw_pile_${card.rank}_${card.suit}`);
        if (cardElement) calculateP2Offset(cardElement);
    
        setMovingCard(card);
    
        setTimeout(() => {
        setPlayer2Card(prevCards => [...prevCards, card]);
        setMovingCard(null);
        }, 400);
    };
    
    return (
    <div className="body">
        <img id="backgroundimg" src={backgroundImg} />
        <img id="briscasColimg" src={briscasColimg} ref={columnRef} />

        <div id="upperButtons" style={{
            position: "fixed",
            top: "2vh",
            left: `${columnCenter}px`,
            transform: "translateX(-50%)",
            zIndex: 10,
        }}
        >
            <Link to='/'><button className = "buttons"> Main Menu</button> </Link>
            <Link to='/Settings'><button className = "buttons"> Settings</button> </Link>
            <button className="buttons" onClick={() => setDebugOpen(true)}>DEBUG</button>
        </div>
        <div id="lowerButtons" style={{
            position: "fixed",
            bottom: "2vh",
            left: `${columnCenter}px`,
            transform: "translateX(-50%)",
            zIndex: 10,
        }}
        >
                <button className = "buttons"> Pause Game</button> 
                <button className = "buttons"> New Game</button> 
                <button className = "buttons"> Exit Game</button> 
        </div>

        {currentTurn && (
            <div
                style={{
                position: "fixed",
                top: "2vh",
                right: "3vw",
                fontFamily: "monospace",
                textAlign: "right",
                zIndex: 10,
                }}
            >
            <div
                style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: currentTurn === "1" ? "#4caf50" : "#ff9800",
                    marginBottom: "4px",
                }}
                >
                {currentTurn === "1" ? "🎯 Your Turn" : "⏳ Opponent's Turn"}
            </div>
            <div style={{ fontSize: "1rem", color: "#4caf50", marginBottom: "2px" }}>
                Your Score: {player1Score}
            </div>
            <div style={{ fontSize: "1rem", color: "#ff9800" }}>
                AI Score: {player2Score}
            </div>
            </div>
        )}

        <div className = "game-board-container">
            <div className="game-board">
                <div id="player1-hand">
                    <div className="card player1-hand" ref = {player1HandRef} style = {{
                        position: "fixed",
                        bottom: "40px",
                        left: `${player1OffsetX}px`,
                    }}  >
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
                <div className="card player2-hand"
                    ref={player2HandRef}
                    style={{
                        position: "fixed",
                        top: "40px",
                        left: `${player2OffsetX}px`
                    }}        >
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
                <div 
                    className="card trump-card"
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: `${trumpOffsetX}px`,
                        transform: "translateY(-50%) rotate(-90deg)"
                    }}
                    >
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
                <div 
                    className="card draw-pile"
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: `${drawOffsetX}px`,
                        transform: "translateY(-50%)"
                    }}
                    >
                    {drawPileCard.map((card, index) => (
                        <img
                            key={card.id}
                            src={flippedCard === card ? getCardImage(card.suit, card.rank) : "../assets/back.png"}
                            alt={`Card ${card.rank} of ${card.suit}`}
                            id={`draw_pile_${card.rank}_${card.suit}`}
                            onMouseEnter={() => handleHover("draw_pile",card.rank,card.suit, true)}
                            onMouseLeave={() => handleHover("draw_pile",card.rank,card.suit, false)}
                            className={`card ${flippingCard === card ? "flipping" : ""} ${movingCard === card ? "moving" : ""} ${index === 0 ? "top-card" : ""}`}
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
                    ref={discardPileRef}
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: `${discardOffsetX}px`,
                        transform: "translateY(-50%)",
                    }}>
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
                {roundWinner && (
                    <div className="round-winner-banner"
                    style={{
                        left: `${bannerOffsetX}px`,
                        transform: "translate(-50%, -50%)",
                    }}
                    >
                        🏆 {roundWinner} wins the round!
                    </div>
                )}
            </div>
            {debugOpen && (
                <>
                    <h3 style={{ fontFamily: "monospace", color: "#0f0", textAlign: "center" }}>
                    Debug Console
                    </h3>
                    <GameConsole onClose={() => setDebugOpen(false)} />
                </>
                )}
        </div>
    </div>
    );
  };
  
  
  export default GameBoard;

