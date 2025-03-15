const Deck = require("./Deck");
const Player = require("./Player");
const GameState = require("./GameState");
const RoundManager = require("./Winner");
const AIPlayerModel = require("../models/ai/AIPlayerModel"); //const AIPlayer = require("./AIPlayer"); Renamed

class GameManager {
  constructor(playerNames) {
    this.deck = new Deck();
    this.deck.shuffle();
    this.trumpCard = this.deck.setupTrumpSuit();
    this.players = playerNames.map((name, index) => {
    this.gameState = new GameState(); //tweaked AI handling to better suit new code
      if (name === "AI") {
        return new AIPlayerModel([], 0, index === 0);
      } 
      else {
        return new Player([], 0, index === 0);
      }
    }); // Player 1 starts with isTurn = true
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
  /**
   * Handles a player's attempt to play a card
   * 
   * This method manages both human and AI player turns, with special handling for AI players:
   * - For human players: Validates the move and immediately plays the provided card
   * - For AI players: Triggers an asynchronous AI decision process with built-in safeguards
   * 
   * @param {number} playerIndex - Index of the player attempting to play
   * @param {Card} card - Card to play (required for human players, ignored for AI)
   * @throws {Error} If it's not the player's turn or a human provides no card
   */
  playCard(playerIndex, card = null) {
    const player = this.players[playerIndex];

    if (this.currentTurnIndex !== playerIndex) {
      throw new Error("It's not your turn!");
    }

    if (player.isAI) {
      // SAFEGUARD 1: Skip if AI is already thinking to prevent duplicate calls
      // This prevents the AI from being called multiple times during its turn
      if (player.isThinking) {
        //ai is already thinking, not calling again
        return;
      }
      
      // ASYNC TURN HANDLING: Process AI turns asynchronously to prevent blocking the game loop
      // This allows the game to remain responsive during AI "thinking time"
      setTimeout(async () => {
        try {
          // SAFEGUARD 2: Track the original player to ensure turn hasn't changed
          // This prevents the AI from playing out of turn if game state changed during thinking
          const playerBeforeCard = playerIndex;
          
          // Request a card selection from the AI player
          const aiCard = await player.handleTurn(this.gameState);
          
          // SAFEGUARD 3: Verify turn hasn't changed during AI thinking
          // This prevents turn desynchronization issues
          if (this.currentTurnIndex !== playerBeforeCard) {
            return;
          }
          
          // SAFEGUARD 4: Verify AI returned a valid card
          // This prevents errors when playing null or undefined cards
          if (!aiCard) {
            throw new Error("AI returned no card");
          }

          this.roundManager.playCard(`player${playerIndex + 1}`, aiCard);
          this.switchTurn();

          if (
            Object.keys(this.roundManager.playedCards).length === this.players.length
          ) {
            const roundWinner = this.roundManager.determineWinner();

            this.switchTurn(); // Winner starts next round
          }
        } catch (error) {
          console.error("AI Error:", error);
          // ERROR RECOVERY: Switch turns even after AI errors
          // This prevents the game from getting stuck if an AI fails to play
          if (player.isTurn) {
            this.switchTurn();
          }
        }
      }, player.thinkingTime);
    } else {
      // Handle regular player turn
      if (!card) {
        throw new Error("Card must be provided for regular player");
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