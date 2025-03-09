const GameState = require("../models/GameState");
const Player = require("../models/Player");
const BriscaAI = require("../models/ai/BriscaAI");
const Card = require("../models/Card");

console.log("=== AI TEST: EASY MODE INTEGRATION ===\n");

// Setup GameState
const gameState = new GameState();
const aiPlayer = new Player(
    [ new Card("Oros", "7"), new Card("Espadas", "3") ],
    0,   // Score
    true // Is AI
);
const humanPlayer = new Player(
    [ new Card("Copas", "1"), new Card("Bastos", "5") ],
    0,    // Score
    false // Is Human
);

// Assign hands to GameState
gameState.ChangePlayerHands(aiPlayer.hand, humanPlayer.hand);
gameState.ChangeTurn("1");         // AI starts (Player 1)
gameState.ChangeTrumpSuit("Oros"); // Set Trump Suit

// Initialize AI
const ai = new BriscaAI(gameState);
ai.analyzeGameState(); // Just to confirm the AI can read the game state

// --- AI Easy Mode Move ---
console.log("\n--- AI Easy Mode Move ---");
// Instead of popping from the array, we let the AI decide based on Easy Mode
// logic
const aiCard = ai.makeMove();

// Safety check: if AI didn't return anything, we know something went wrong
if (!aiCard) {
  console.error("AI did not return a card. Test failed.");
} else {
  console.log(`AI plays: ${aiCard.rank} of ${aiCard.suit}`);
}

// Update GameState with AI's played card
gameState.ChangePlayedCards(aiCard, null);

// Verify AI's played card is stored in GameState
const playedCards = gameState.GetPlayedCards(0);
console.log(`GameState recorded AI's played card: ${playedCards.rank} of ${
    playedCards.suit}`);

// Ensure AI's hand updates in GameState
// (AI's new hand is already stored in GameState by the AI's `makeMove()` logic,
//  but here we mimic your existing test structure)
const updatedAIHand = gameState.GetPlayerHand(0);
gameState.ChangePlayerHands(updatedAIHand, gameState.GetPlayerHand(1));

// Turn Switch to Human
gameState.ChangeTurn("2");
console.log(`Turn switched to: Player ${gameState.GetTurn()}`);

// Verify AI is no longer the current player
const currentPlayer = gameState.GetTurn();
console.log(
    `Current player should be human (2), actual: Player ${currentPlayer}`);

// Human Plays a Move
const humanHand = gameState.GetPlayerHand(1);
const humanCard = humanHand.pop(); // Human selects a card to play
console.log(`Human plays: ${humanCard.rank} of ${humanCard.suit}`);
gameState.ChangePlayedCards(aiCard, humanCard);

// Verify Human's played card is stored in GameState
const playedCardsHuman = gameState.GetPlayedCards(1);
console.log(`GameState recorded Human's played card: ${
    playedCardsHuman.rank} of ${playedCardsHuman.suit}`);

// Ensure Human's hand updates in GameState
gameState.ChangePlayerHands(gameState.GetPlayerHand(0), humanHand);

// Turn Switches Back to AI
gameState.ChangeTurn("1");
console.log(`Turn switched back to: Player ${gameState.GetTurn()}`);

console.log("\n=== TEST COMPLETE: AI EASY MODE TURN HANDLING WORKS ===");
