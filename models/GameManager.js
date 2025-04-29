const Deck = require("./Deck");
const Player = require("./Player");
const GameState = require("./GameState");
const RoundManager = require("./Winner");
const AIPlayerModelN = require("../models/ai/AINormal"); //const AIPlayer = require("./AIPlayer"); Renamed

class GameManager {
  constructor(playerNames, turnOrder, trumpSuit) {
    this.deck = new Deck();
    this.deck.shuffle();
    this.trumpCard = this.deck.setupTrumpSuit();
    this.players = playerNames.map((name, index) => {
    this.gameState = new GameState(); //tweaked AI handling to better suit new code
      if (name === "AI") {
        return new AIPlayerModelN(this.gameState, [], 0, index === 0);
      } 
      else {
        return new Player([], 0, index === 0);
      }
    }); // Player 1 starts with isTurn = true
    this.roundManager = new RoundManager(this.trumpCard.suit, this.getMapSize(this.players));
    this.currentTurnIndex = parseInt(turnOrder-1);
    // hand = [null, null, null];
    // this.gameState.ChangePlayerHands(this.players[0].hand, this.players[1].hand, this.players[2].hand, this.players[3].hand);
    this.gameState.ChangeTurn(turnOrder);
    this.gameState.ChangeTrumpSuit(trumpSuit);
    this.gameState.ChangeDeck(new Deck)
    this.dealInitialHands();
  }

  // Deal 3 cards to each player
  dealInitialHands() {
    for (let i = 0; i < 3; i++) {
      this.players.forEach((player) => {
        player.setInitialHand(this.deck.draw());
      });
    }
  }
getPlayers(){ // Get all players
  return this.players;
}
getDeck(){ // Get the deck
  return this.deck; 
}
  // Get current player
  getCurrentPlayer() {
    return this.players[this.currentTurnIndex];
  }

  switchTurn() {
    this.players[this.currentTurnIndex].isTurn = false; // End current player's turn
    if( this.getMapSize(this.players) > 4){
      if(this.currentTurnIndex == 3){
        this.currentTurnIndex = 0;
      }
      else{
      this.currentTurnIndex = (this.currentTurnIndex + 1) % 4; }
    }
    else{
      if(this.currentTurnIndex+1 == (this.getMapSize(this.players))){
        // console.log("current turn = ", this.currentTurnIndex);
        this.currentTurnIndex = 0;
        // console.log("current turn = ", this.currentTurnIndex);

      }
      else{
        // console.log("current turn = ", this.currentTurnIndex);
        this.currentTurnIndex = (this.currentTurnIndex + 1);
        // console.log("current turn = ", this.currentTurnIndex);
        }
    }
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
            Object.keys(this.roundManager.playedCards).length === this.getMapSize(this.players)
          ) {
            const roundWinner = this.roundManager.determineWinner();
            console.log(`Round Winner: ${roundWinner}`);
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
        Object.keys(this.roundManager.playedCards).length === this.getMapSize(this.players)
      ) {
        const roundWinner = this.roundManager.determineWinner();
        console.log(`Round Winner: ${roundWinner}`);

        //this.switchTurn(); // Winner starts next round
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
   getMapSize(x) {
    var len = 0;
    for (var count in x) {
            len++;
    }
  
    return len;
  }
}

module.exports = GameManager;