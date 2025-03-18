const GameManager = require("../models/GameManager");

//initialize game for two players
const game = new GameManager(["Alice", "Bob", "P3"]);

console.log("\n=== Initial Game Setup ===");
//display trump suit
console.log(`Trump Suit: ${game.trumpCard.suit}`);
//randomize 3 cards each
console.log(
  `Player 1 Hand: ${game.players[0].hand
    .map((card) => card.displayCard())
    .join(", ")}`
);
console.log(
  `Player 2 Hand: ${game.players[1].hand
    .map((card) => card.displayCard())
    .join(", ")}`
);
console.log(
  `Player 3 Hand: ${game.players[2].hand
    .map((card) => card.displayCard())
    .join(", ")}`
);

// Test turn system
console.log("\n=== Testing Turn System ===");
console.log(`Current Player: Player ${game.currentTurnIndex + 1}`);
console.log("\n=== Player 1 Plays a Card ===");
//pick first card
const player1Card = game.players[0].hand[0];
game.playCard(0, player1Card);
//play card
console.log(`Player 1 played: ${player1Card.displayCard()}`);

console.log("\n=== Player 2 Plays a Card ===");
const player2Card = game.players[1].hand[0];
game.playCard(1, player2Card);
console.log(`Player 2 played: ${player2Card.displayCard()}`);

const player3Card = game.players[2].hand[0];
game.playCard(2, player3Card);
console.log(`Player 3 played: ${player3Card.displayCard()}`);


console.log("\n=== Testing Switch Turn ===");
// console.log("\n turn:", game.gameState.player_turn);
// game.switchTurn();
// console.log("\n turn:", game.gameState.player_turn);




console.log("\n=== Testing Invalid Turn ===");
try {
  game.playCard(0, game.players[0].hand[0]); //player one tries to play again
} catch (error) {
  console.log(`Error caught: ${error.message}`);
}

// Test game restart re shuffle cards and distribute
console.log("\n=== Restarting Game ===");
game.restartGame();
console.log(`Trump Suit After Restart: ${game.trumpCard.suit}`);
console.log(
  `New Player 1 Hand: ${game.players[0].hand
    .map((card) => card.displayCard())
    .join(", ")}`
);
console.log(
  `New Player 2 Hand: ${game.players[1].hand
    .map((card) => card.displayCard())
    .join(", ")}`
);
