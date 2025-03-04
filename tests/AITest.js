const GameState = require("../models/GameState");
const Player = require("../models/Player");
const BriscaAI = require("../models/ai/BriscaAI");
const Card = require("../models/Card");

console.log("=== AI TEST: GAMESTATE INTEGRATION ===\n");

// Setup GameState
const gameState = new GameState();
const aiPlayer = new Player([new Card("Oros", "7"), new Card("Espadas", "3")], 0, true);
const humanPlayer = new Player([new Card("Copas", "1"), new Card("Bastos", "5")], 0, false);

// Assign hands to GameState
gameState.ChangePlayerHands(aiPlayer.hand, humanPlayer.hand);
gameState.ChangeTurn("1"); // AI starts (Player 1)
gameState.ChangeTrumpSuit("Oros"); // Set Trump Suit

// Initialize AI
const ai = new BriscaAI(gameState);
ai.analyzeGameState(); // Expected output: AI retrieves correct game data

// AI Plays a Move
const aiHand = gameState.GetPlayerHand(0); // AI's hand from GameState
const aiCard = aiHand.pop(); // AI plays the first available card

console.log(`AI plays: ${aiCard.rank} of ${aiCard.suit}`);
gameState.ChangePlayedCards(aiCard, null);

// Verify AI's played card is stored in GameState
const playedCards = gameState.GetPlayedCards(0);
console.log(`GameState recorded AI's played card: ${playedCards.rank} of ${playedCards.suit}`);

// Ensure AI's hand updates in GameState
gameState.ChangePlayerHands(aiHand, gameState.GetPlayerHand(1));

// Turn Switch to Human
gameState.ChangeTurn("2");
console.log(`Turn switched to: Player ${gameState.GetTurn()}`);

// Verify AI is no longer the current player
const currentPlayer = gameState.GetTurn();
console.log(`Current player should be human (2), actual: Player ${currentPlayer}`);

// Human Plays a Move
const humanHand = gameState.GetPlayerHand(1);
const humanCard = humanHand.pop(); // Human plays a card

console.log(`Human plays: ${humanCard.rank} of ${humanCard.suit}`);
gameState.ChangePlayedCards(aiCard, humanCard);

// Verify Human's played card is stored in GameState
const playedCardsHuman = gameState.GetPlayedCards(1);
console.log(`GameState recorded Human's played card: ${playedCardsHuman.rank} of ${playedCardsHuman.suit}`);

// Ensure Human's hand updates in GameState
gameState.ChangePlayerHands(gameState.GetPlayerHand(0), humanHand);

// Turn Switches Back to AI
gameState.ChangeTurn("1");
console.log(`Turn switched back to: Player ${gameState.GetTurn()}`);

console.log("\n=== TEST COMPLETE: AI TURN HANDLING WORKS ===");
