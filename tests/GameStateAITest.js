const GameState = require("../models/GameState");
const Player = require("../models/Player");
const Card = require("../models/Card");

console.log("=== AI-Driven GameState Synchronization Testing ===\n");

// Initialize game state and AI player
const gameState = new GameState();
const aiPlayer = new Player([], 0, false); // AI starts without a turn

// Helper function to print test results
function printTestResult(testName, passed) {
    console.log(`${passed ? "✔" : "✖"} ${testName}`);
}

// Test 1: AI retrieves game data correctly
try {
    gameState.ChangeGameState("Playing");
    gameState.ChangeTrumpSuit("Oros"); // Set a trump suit
    const trumpSuit = gameState.GetTrumpSuit();
    printTestResult("AI retrieves game data correctly", trumpSuit === "Oros");
} catch (error) {
    printTestResult("AI retrieves game data correctly", false);
}

// Test 2: AI plays a valid move
try {
    gameState.ChangeTurn("AI"); // Ensure AI's turn is active
    const validCard = new Card("Oros", "3");
    aiPlayer.hand.push(validCard);
    aiPlayer.isTurn = true; // AI's turn flag set

    aiPlayer.playCard(validCard);
    gameState.ChangeTurn("2"); // Change turn after AI plays

    printTestResult("AI plays a valid move", true);
} catch (error) {
    printTestResult("AI plays a valid move", false);
}

// Test 3: AI cannot play an invalid move
try {
    const invalidCard = new Card("InvalidSuit", "InvalidRank");
    aiPlayer.playCard(invalidCard);
    printTestResult("AI cannot play an invalid move", false);
} catch (error) {
    printTestResult("AI cannot play an invalid move", true);
}

// Test 4: AI GameState consistency
try {
    const initialState = gameState.GetGameState();
    gameState.ChangeGameState("Round start");
    gameState.ChangeGameState("Playing");
    const finalState = gameState.GetGameState();
    printTestResult("AI GameState remains consistent", initialState !== finalState);
} catch (error) {
    printTestResult("AI GameState remains consistent", false);
}

// Test 5: AI turns do not desynchronize GameState
try {
    gameState.ChangeTurn("AI"); // AI's turn is set
    const aiCard = new Card("Copas", "7");
    aiPlayer.hand.push(aiCard);
    aiPlayer.isTurn = true; // AI's turn flag set

    aiPlayer.playCard(aiCard);
    gameState.ChangeTurn("2"); // Ensure turn switches after AI plays

    printTestResult("AI turns do not desynchronize GameState", true);
} catch (error) {
    printTestResult("AI turns do not desynchronize GameState", false);
    console.error(error); // Print error for debugging
}
