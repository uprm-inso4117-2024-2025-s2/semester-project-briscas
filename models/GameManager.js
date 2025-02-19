const Deck = require("./Deck");
const Player = require("./Player");
const GameState = require("./GameState");
const RoundManager = require("./Winner");

class GameManager {
  constructor(playerNames) {
    this.deck = new Deck();
    this.deck.shuffle();
    this.trumpCard = this.deck.setupTrumpSuit();
    this.players = playerNames.map(
      (name, index) => new Player([], 0, index === 0)
    ); // Player 1 starts with isTurn = true
    this.gameState = new GameState();
    this.roundManager = new RoundManager(this.trumpCard.suit);
    this.currentTurnIndex = 0;

    this.dealInitialHands();
  }

  // Deal 3 cards to each player
  dealInitialHands() {
    for (let i = 0; i < 3; i++) {
      this.players.forEach((player) => {
        player.hand.push(this.deck.draw());
      });
    }
  }

  // Get current player
  getCurrentPlayer() {
    return this.players[this.currentTurnIndex];
  }

  switchTurn() {
    this.players[this.currentTurnIndex].isTurn = false; // End current player's turn
    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length;
    this.players[this.currentTurnIndex].isTurn = true; // Set next player's turn
  }

  // Play a card
  playCard(playerIndex, card) {
    const player = this.players[playerIndex];

    if (this.currentTurnIndex !== playerIndex) {
      throw new Error("It's not your turn!");
    }

    const playedCard = player.playCard(card);
    this.roundManager.playCard(`player${playerIndex + 1}`, playedCard);

    this.switchTurn();

    if (
      Object.keys(this.roundManager.playedCards).length === this.players.length
    ) {
      const roundWinner = this.roundManager.determineWinner();
      console.log(`Round Winner: ${roundWinner}`);

      this.switchTurn(); // Winner starts next round
    }
  }

  // Restart game
  restartGame() {
    this.deck = new Deck();
    this.deck.shuffle();
    this.trumpCard = this.deck.setupTrumpSuit();
    this.players.forEach((player) => {
      player.hand = [];
      player.score = 0;
    });

    this.dealInitialHands();
    this.currentTurnIndex = 0;
    console.log("Game restarted!");
  }
}

module.exports = GameManager;
