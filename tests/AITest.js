const GameState = require("../models/GameState");
const Player = require("../models/Player");
const AIPlayerModel = require("../models/ai/AIPlayerModel"); //const BriscaAI = require("../models/ai/BriscaAI"); renamed
const Card = require("../models/Card");
const RoundManager = require("../models/Winner");

console.log("=== AI TEST: GAMESTATE INTEGRATION ===\n");

// Setup GameState
const gameState = new GameState();
const aiPlayer = new AIPlayerModel(gameState, [new Card("Oros", "7"), new Card("Espadas", "3")], 0, true);
const humanPlayer = new Player([new Card("Copas", "1"), new Card("Oros", "5")], 0, false);
const roundManager = new RoundManager("Oros");

// Assign hands to GameState
gameState.ChangePlayerHands(aiPlayer.hand, humanPlayer.hand, null, null);
gameState.ChangeTurn("1"); // AI starts (Player 1)
gameState.ChangeTrumpSuit("Oros"); // Set Trump Suit

// Initialize AI
//const ai = new AIPlayerModel(gameState); deprecated
//ai.handleTurn();  // Expected output: AI retrieves correct game data
// AI Plays a Move
const aiCard = aiPlayer.hand[0]; // Get the first card from AI's hand
aiPlayer.hand = aiPlayer.hand.filter(card => card !== aiCard); // Remove the card from AI's hand

console.log(`AI plays: ${aiCard.rank} of ${aiCard.suit}`);
gameState.ChangePlayedCards(aiCard, null, null, null);

// Verify AI's played card is stored in GameState
const playedCards = gameState.GetPlayedCards(0);
console.log(`GameState recorded AI's played card: ${playedCards.rank} of ${playedCards.suit}`);

// Ensure AI's hand updates in GameState
gameState.ChangePlayerHands(aiPlayer.hand, gameState.GetPlayerHand(1), null, null);

// Turn Switch to Human
gameState.ChangeTurn("2");
aiPlayer.turnToggle();
humanPlayer.turnToggle();
console.log(`Turn switched to: Player ${gameState.GetTurn()}`);

// Verify AI is no longer the current player
const currentPlayer = gameState.GetTurn();
console.log(`Current player should be human (2), actual: Player ${currentPlayer}`);

// Human Plays a Move
const humanHand = gameState.GetPlayerHand(1);
const humanCard = humanHand.pop(); // Human plays a card

console.log(`Human plays: ${humanCard.rank} of ${humanCard.suit}`);
gameState.ChangePlayedCards(aiCard, humanCard, null, null);

// Verify Human's played card is stored in GameState
const playedCardsHuman = gameState.GetPlayedCards(1);
console.log(`GameState recorded Human's played card: ${playedCardsHuman.rank} of ${playedCardsHuman.suit}`);

// Ensure Human's hand updates in GameState
gameState.ChangePlayerHands(gameState.GetPlayerHand(0), humanHand, null, null);

// Turn Switches Back to AI
gameState.ChangeTurn("1");
console.log(`Turn switched back to: Player ${gameState.GetTurn()}`);

roundManager.playCard("player1", aiCard); // 10 points
roundManager.playCard("player2", humanCard); // 0 points
const result = roundManager.getRoundWinnerData();
console.log(`\n🔹 ${"Test 1: Trump card wins (Player 2 should win)"}`);
console.log(`Winner: ${result.winner}`);
console.log(
  `Scores: Player 1 = ${result.scores.player1}, Player 2 = ${result.scores.player2}\n`
);
console.log("\n=== TEST COMPLETE: AI TURN HANDLING WORKS ===");

console.log("\n---------------------------------------------")
console.log("\n === AI TEST: SCORE HANDLING ===")
console.log("AI Current Score is", aiPlayer.getScore())
aiPlayer.setScore(200)
console.log("AI Score set to 200, expected value is 200, real value is", aiPlayer.getScore())
aiPlayer.addScore(20)
console.log("20 added to AI,expected value is 220, real value is", aiPlayer.getScore())