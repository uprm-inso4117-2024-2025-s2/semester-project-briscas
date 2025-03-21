const GameManager = require("../tests/GManagerPerformance");
const AINormal = require("../models/ai/AINormal");

console.log("\n=== Performance Testing AINormal AI in Briscas ===");

// Initialize a game manager with two AI players
const game = new GameManager(["AI", "AI"]);

console.log(`Trump Suit: ${game.trumpCard.suit}`);

const roundsToSimulate = 10; // Number of rounds for performance testing
const executionTimes = [];

// Function to measure AI decision-making time
const measureAITurn = async (roundNumber) => {
  console.log(`\n--- Round ${roundNumber} ---`);

  let turnsPlayed = 0;

  while (turnsPlayed < game.players.length) {
    const currentTurnIndex = game.currentTurnIndex;
    const currentPlayer = game.players[currentTurnIndex];

    if (currentPlayer.isAI) {
      console.log(`AI Player ${currentTurnIndex + 1} is playing...`);

      const startTime = performance.now();

      // Wait for AI decision
      await new Promise((resolve) => {
        setTimeout(async () => {
          try {
            await game.playCard(currentTurnIndex);
          } catch (error) {
            console.error(`Error playing AI turn: ${error.message}`);
          }
          const endTime = performance.now();
          executionTimes.push(endTime - startTime); // Record execution time
          resolve();
        }, currentPlayer.thinkingTime);
      });

      turnsPlayed++;
    } else {
      console.log(
        `Human Player ${
          currentTurnIndex + 1
        } is playing (Manual Move Required).`
      );
      turnsPlayed++;
    }
  }
};

// Run the performance test
(async () => {
  for (let i = 1; i <= roundsToSimulate; i++) {
    await measureAITurn(i);
  }

  console.log("\n=== Performance Test Completed ===");

  // Calculate average execution time
  const averageTime =
    executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length;
  console.log(
    `\n⏱️  Average AI decision-making time: ${averageTime.toFixed(2)}ms`
  );

  // Log min & max execution times
  console.log(
    `🔹 Fastest AI turn: ${Math.min(...executionTimes).toFixed(2)}ms`
  );
  console.log(
    `🔹 Slowest AI turn: ${Math.max(...executionTimes).toFixed(2)}ms`
  );
})();
