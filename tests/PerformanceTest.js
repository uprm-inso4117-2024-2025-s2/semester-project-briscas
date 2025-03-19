const GameManager = require("./GManagerPerformance");

console.log("\n=== Performance Testing Briscas Game ===");

// Initialize game with AI players
const game = new GameManager(["AI", "AI"]);

console.log(`Trump Suit: ${game.trumpCard.suit}`);

// Function to play a round while respecting turn order
const playRound = async (roundNumber) => {
  console.log(`\n--- Round ${roundNumber} ---`);

  let turnsPlayed = 0;

  while (turnsPlayed < game.players.length) {
    const currentTurnIndex = game.currentTurnIndex; // Get the current turn player index
    const currentPlayer = game.players[currentTurnIndex]; // Get the player object

    if (currentPlayer.isAI) {
      console.log(`AI Player ${currentTurnIndex + 1} is playing...`);

      // Wait for AI to decide before switching turns
      await new Promise((resolve) => {
        setTimeout(async () => {
          try {
            await game.playCard(currentTurnIndex);
            resolve();
          } catch (error) {
            console.error(`Error playing AI turn: ${error.message}`);
            resolve();
          }
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

// Simulate 5 rounds with AI players
(async () => {
  for (let i = 1; i <= 5; i++) {
    await playRound(i);
  }

  console.log("\n=== Performance Test Completed ===");
})();
