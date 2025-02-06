const Card = require("../models/Card");
const RoundManager = require("../models/Winner");

console.log("=== ROUND MANAGER TESTS ===\n");

// Setup game with trump suit
const roundManager = new RoundManager("Oros");

// Helper function to print round results
function printRoundResult(testName) {
  const result = roundManager.getRoundWinnerData();
  console.log(`\n🔹 ${testName}`);
  console.log(`Winner: ${result.winner}`);
  console.log(
    `Scores: Player 1 = ${result.scores.player1}, Player 2 = ${result.scores.player2}\n`
  );
}

// Test P.1 plays a higher non-trump, P.2 plays a lower trump
roundManager.playCard("player1", new Card("Copas", "12")); // 4 points
roundManager.playCard("player2", new Card("Oros", "2")); // 0 points
printRoundResult("Test 1: Trump card wins (Player 2 should win)");

// Test  P.1 and P.2 both play non-trump, higher rank wins
roundManager.playCard("player1", new Card("Bastos", "3")); // 10 points
roundManager.playCard("player2", new Card("Bastos", "1")); // 11 points
printRoundResult("Test 2: Higher rank wins (Player 2 should win)");

// Test  Two trump cards, higher rank wins
roundManager.playCard("player1", new Card("Oros", "3")); // 10 points
roundManager.playCard("player2", new Card("Oros", "1")); // 11 points
printRoundResult("Test 3: Higher trump wins (Player 2 should win)");
