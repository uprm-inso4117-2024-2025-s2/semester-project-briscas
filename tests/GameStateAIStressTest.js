const GameState = require("../models/GameState");
const Player = require("../models/Player");
const Card = require("../models/Card");

console.log("=== AI GameState Stress Testing ===\n");

// Configuration: Number of AI players and rounds for stress test
const AI_PLAYERS = 10;  // Simulate 10 AI players
const ROUNDS = 1000;    // Each AI plays 1000 rounds

// Initialize GameState
const gameState = new GameState();
gameState.ChangeGameState("Playing");
gameState.ChangeTrumpSuit("Oros"); // Set a trump suit

// Create AI players
const aiPlayers = [];
for (let i = 0; i < AI_PLAYERS; i++) {
    aiPlayers.push(new Player([], 0, false)); // AI players start with no cards
}

// Function to simulate AI making moves
function aiPlayTurn(aiPlayer, playerId) {
    if (gameState.GetTurn() !== playerId.toString()) return; // Ensure it's their turn

    // AI randomly selects a card to play
    const randomCard = new Card("Oros", (Math.floor(Math.random() * 12) + 1).toString());
    aiPlayer.hand.push(randomCard);
    aiPlayer.isTurn = true;

    try {
        aiPlayer.playCard(randomCard);
        gameState.ChangeTurn(((parseInt(playerId) + 1) % AI_PLAYERS).toString()); // Rotate turns
    } catch (error) {
        console.warn(`AI ${playerId} error: ${error.message}`);
    }
}

// Stress Test Execution
console.time("AI Stress Test");
for (let round = 0; round < ROUNDS; round++) {
    for (let i = 0; i < AI_PLAYERS; i++) {
        aiPlayTurn(aiPlayers[i], i);
    }
}
console.timeEnd("AI Stress Test");

// Memory Usage Check
const memoryUsage = process.memoryUsage();
console.log("\nMemory Usage:");
console.log(`RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`);
console.log(`Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);

// Final GameState Consistency Check
console.log("\nFinal GameState Validation:");
console.log("Current State:", gameState.GetGameState());
console.log("Game Turn:", gameState.GetTurn());

if (gameState.GetGameState() !== "Playing") {
    console.error("❌ GameState became inconsistent after AI stress test!");
} else {
    console.log("✅ GameState remained stable under stress.");
}
