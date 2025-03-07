const { performance } = require("perf_hooks"); // Import performance API
const Deck = require("../models/Deck");
const Player = require("../models/Player");
const GameState = require("../models/GameState");
const RoundManager = require("../models/Winner");
const AIPlayer = require("../models/AIPlayer");

class GameManager {
  constructor(playerNames) {
    // Track deck shuffle time
    const shuffleStart = performance.now();
    this.deck = new Deck();
    this.deck.shuffle();
    const shuffleEnd = performance.now();
    console.log(
      `Deck shuffle time: ${(shuffleEnd - shuffleStart).toFixed(2)}ms`
    );

    // Track trump suit setup time
    const trumpStart = performance.now();
    this.trumpCard = this.deck.setupTrumpSuit();
    const trumpEnd = performance.now();
    console.log(
      `Trump suit setup time: ${(trumpEnd - trumpStart).toFixed(2)}ms`
    );

    this.players = playerNames.map((name, index) => {
      if (name === "AI") {
        return new AIPlayer([], 0, index === 0);
      } else {
        return new Player([], 0, index === 0);
      }
    }); // Player 1 starts with isTurn = true

    this.gameState = new GameState();
    this.roundManager = new RoundManager(this.trumpCard.suit);
    this.currentTurnIndex = 0;

    this.dealInitialHands();
  }

  dealInitialHands() {
    for (let i = 0; i < 3; i++) {
      this.players.forEach((player) => {
        const drawStart = performance.now();
        player.hand.push(this.deck.draw());
        const drawEnd = performance.now();
        console.log(`Card draw time: ${(drawEnd - drawStart).toFixed(2)}ms`);
      });
    }
  }

  playCard(playerIndex, card = null) {
    const player = this.players[playerIndex];

    if (this.currentTurnIndex !== playerIndex) {
      throw new Error("It's not your turn!");
    }

    const startTime = performance.now(); // Start tracking time

    if (player.isAI) {
      if (player.isThinking) return; // Prevent duplicate calls

      setTimeout(async () => {
        try {
          const aiStart = performance.now();
          const aiCard = await player.handleTurn(this.gameState);
          const aiEnd = performance.now();
          console.log(`AI decision time: ${(aiEnd - aiStart).toFixed(2)}ms`);

          if (!aiCard) throw new Error("AI returned no card");

          this.roundManager.playCard(`player${playerIndex + 1}`, aiCard);

          const switchStart = performance.now();
          this.switchTurn();
          const switchEnd = performance.now();
          console.log(
            `Turn switch time: ${(switchEnd - switchStart).toFixed(2)}ms`
          );
        } catch (error) {
          console.error("AI Error:", error);
          if (player.isTurn) this.switchTurn();
        }
      }, player.thinkingTime);
    } else {
      if (!card) {
        throw new Error("Card must be provided for regular player");
      }

      const playedCard = player.playCard(card);
      this.roundManager.playCard(`player${playerIndex + 1}`, playedCard);

      const switchStart = performance.now();
      this.switchTurn();
      const switchEnd = performance.now();
      console.log(
        `Turn switch time: ${(switchEnd - switchStart).toFixed(2)}ms`
      );
    }

    const endTime = performance.now();
    console.log(
      `Total playCard execution time: ${(endTime - startTime).toFixed(2)}ms`
    );
  }

  switchTurn() {
    console.log(
      `Before Switch - Current Turn: Player ${this.currentTurnIndex + 1}`
    );

    this.players[this.currentTurnIndex].isTurn = false;
    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length;
    this.players[this.currentTurnIndex].isTurn = true;

    console.log(
      `After Switch - Next Turn: Player ${this.currentTurnIndex + 1}`
    );
  }

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
  getCurrentPlayer() {
    return this.players[this.currentTurnIndex];
  }
}

module.exports = GameManager;
