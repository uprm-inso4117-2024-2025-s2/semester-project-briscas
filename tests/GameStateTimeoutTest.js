const GameState = require("../models/GameState");

console.log("=== GAME STATE TIMEOUT TESTS ===\n");

// Setup game state
const gameState = new GameState();

// Helper function to simulate delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test timeout and auto-pass
async function testTimeoutAndAutoPass() {
  console.log("\n🔹 Test 1: Timeout and Auto-Pass");
  gameState.beginAction("play", 1);
  await delay(6000); // Wait for longer than the timeout period
  console.log("\nCurrent Action:", gameState.current_action);
  console.log("\nGame State:", gameState.GetGameState());
}

testTimeoutAndAutoPass().then(() => {
  console.log("\nTest completed.");
}); 