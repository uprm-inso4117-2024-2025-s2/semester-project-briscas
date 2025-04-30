const Card = require("../models/Card");
const RoundManager = require("../models/Winner");
const Deck = require("../models/Deck");

class GameState {
  constructor() {    
    this.game_states = ["New game", "Round start", "Playing", "Round end", "Game end", "Interrupted", "Recovering", "Failed recovery"];
    this.game_status = {
      isRecoverable: true,
      lastError: null,
      recoveryAttempts: 0,
      maxRecoveryAttempts: 3
    };
    this.state = "New game";
    this.turn = ["1","2"];
    this.player_turn = null;
    this.deck = null;
    this.trump_suit = null;
    this.played_cards = [null, null, null, null];
    this.scores = [0, 0, 0, 0];
    this.player_hands = [null, null, null, null];
    // Updated to support a 4-player game (adjust if needed)
    this.player_status = ["connected", "connected", "connected", "connected"];
    this.last_saved_state = null;
    this.current_action = {
      inProgress: false,
      type: null,
      playerId: null,
      startTime: null,
      timeoutMs: 5000 // 5 second timeout for actions
    };
  }

  ValidState(){
    if(this.state == null){
      console.warn(`Invalid game state: ${this.state}`);
    }
    if(this.state === "Round start" || this.state === "Round end" || this.state === "Playing"){
      if(this.player_turn == null){
        console.warn(`Invalid player turn: null`);
      }
      if(this.deck == null){
        console.warn(`Invalid deck: null`);
      }
      if(this.trump_suit == null){
        console.warn(`Invalid trump suit: null`);
      }
      if(this.played_cards[0] == null || this.played_cards[1] == null){
        console.warn("Invalid played cards: null");
      }
      if(this.scores[0] == null || this.scores[1] == null){
        console.warn("Invalid scores: null");
      }
      if(this.player_hands[0] == null || this.player_hands[1] == null){
        console.warn("Invalid player hands: null");
      }
    }
    if (this.state === "Recovering") {
      if (!this.last_saved_state) return false;
      if (!this.deck) return false;
    }
    if (this.state !== "Interrupted" && this.state !== "Game end") {
      if (!this.isGamePlayable()) {
        console.warn("Game cannot continue with missing players");
        return false;
      }
    }
    if (this.current_action.inProgress) {
      if (Date.now() - this.current_action.startTime > this.current_action.timeoutMs) {
        console.warn("Detected stuck action - rolling back");
        this.rollbackAction();
      }
    }
    return true;
  }

  GetGameState(){
    return this.state;
  }

  ChangeGameState(state){
    if (!this.game_states.includes(state)) {
      console.warn(`Invalid game state: ${state}`);
      this.state = null;
    } else {
      this.state = state;
    }
  }
    
  GetTurn(){
    return this.player_turn;
  }
  
  ChangeTurn(turn) {
    if (["1", "2", "3", "4"].includes(turn)) {
      this.player_turn = turn;
    } else {
      console.error(`Invalid player turn: ${turn}`);
    }
  }

  GetDeck(){
    return this.deck;
  }
  
  ChangeDeck(deck){
    this.deck = deck;
  }

  GetTrumpSuit(){
    return this.trump_suit;
  }
  
  ChangeTrumpSuit(trump_suit){
    this.trump_suit = trump_suit;
  }

  GetPlayedCards(player){
    return this.played_cards[player];
  }
  
  ChangePlayedCards(...cards){
    if(cards.length === 4) {
      this.played_cards = [...cards];
    } else {
      console.error("Expected 4 cards for ChangePlayedCards");
    }
  }

  GetScores(player) {
    if (player !== undefined) {
      return this.scores[player];
    }
    return this.scores;
  }
  
  ChangeScores(player, score) {
    if (typeof player === 'number' && player >= 0 && player < 4) {
      this.scores[player] = parseInt(score) || 0;
    }
  }

  GetPlayerHand(player){
    return this.player_hands[player];
  }
  
  ChangePlayerHands(...hands){
    if(hands.length === 4) {
      this.player_hands = [...hands];
    } else {
      console.error("Expected 4 hands for ChangePlayerHands");
    }
  }

  ResetGame(){
    this.state = "New game";
    this.turn = ["1", "2"];
    this.player_turn = null;
    const deck = new Deck();
    deck.shuffle();
    this.trump_suit = deck.setupTrumpSuit();
    this.deck = deck;
    this.played_cards = [null, null, null, null];
    this.scores = [0, 0, 0, 0];
    this.player_hands = [null, null, null, null];
    this.player_status = ["connected", "connected", "connected", "connected"];
    this.last_saved_state = null;
    this.game_status = {
      isRecoverable: true,
      lastError: null,
      recoveryAttempts: 0,
      maxRecoveryAttempts: 3
    };
    return {
      status: "reset_successful",
      newState: this.state,
      scores: this.scores.slice(0, 2)
    };
  }

  handlePlayerDisconnection(playerId) {
    this.saveGameState();
    // Mark the player as disconnected (assuming playerId maps to index playerId - 1)
    this.player_status[playerId - 1] = "disconnected";
    const previousState = this.state;
    this.state = "Interrupted";
    return {
      status: "game_interrupted",
      reason: "player_disconnected",
      player: playerId,
      gameState: {
        previous: previousState,
        current: this.state,
        scores: [...this.scores],
        canRecover: true,
        remainingPlayer: playerId === 1 ? 2 : 1 // adjust based on game logic
      }
    };
  }

  handleCriticalError() {
    this.state = "Failed recovery";
    return {
      status: "critical_error",
      canRestart: true,
      message: "Game entered an unrecoverable state. Please start a new game."
    };
  }

  saveGameState() {
    this.last_saved_state = {
      state: this.state,
      player_turn: this.player_turn,
      trump_suit: this.trump_suit,
      played_cards: [...this.played_cards],
      scores: [...this.scores],
      player_hands: [...this.player_hands],
      player_status: [...this.player_status],
      timestamp: new Date().toISOString()
    };
  }

  restoreGameState() {
    if (!this.last_saved_state) {
      return {
        status: "failed",
        reason: "no_saved_state"
      };
    }
    const savedState = this.last_saved_state;
    this.state = savedState.state;
    this.player_turn = savedState.player_turn;
    this.trump_suit = savedState.trump_suit;
    this.played_cards = [...savedState.played_cards];
    this.scores = [...savedState.scores];
    this.player_hands = [...savedState.player_hands];
    this.player_status = [...savedState.player_status];
    return {
      status: "restored",
      state: this.state,
      playerStatus: [...this.player_status],
      scores: [...this.scores],
      timestamp: savedState.timestamp
    };
  }

  isGamePlayable() {
    return this.player_status.every(status => status === "connected");
  }

  reconnectPlayer(playerId) {
    console.log(`Attempting to reconnect player ${playerId}`);
    // Mark the player as connected again
    this.player_status[playerId - 1] = "connected";
    // If the game was interrupted due to a disconnection, start the recovery process
    if (this.state === "Interrupted") {
      // Indicate that recovery is in progress
      this.state = "Recovering";
      // If all players have now reconnected, restore the game state
      if (this.isGamePlayable()) {
        const restored = this.restoreGameState();
        console.log(`Game state restored for player ${playerId}`);
        return restored;
      } else {
        console.log(`Player ${playerId} reconnected, waiting for other players.`);
        return {
          status: "reconnected",
          canResume: false,
          message: "Waiting for other players to reconnect."
        };
      }
    } else {
      console.log(`Player ${playerId} reconnected in state ${this.state}`);
      return {
        status: "reconnected",
        canResume: true,
        currentState: this.state
      };
    }
  }

  beginAction(actionType, playerId) {
    try {
      if (this.current_action.inProgress) {
        if (Date.now() - this.current_action.startTime > this.current_action.timeoutMs) {
          this.rollbackAction();
        } else {
          throw new Error("Another action is in progress");
        }
      }
      this.saveGameState();
      this.current_action = {
        inProgress: true,
        type: actionType,
        playerId: playerId,
        startTime: Date.now(),
        timeoutMs: 5000
      };
      // Start a timeout to auto-pass if the player takes too long
      setTimeout(() => {
        if (this.current_action.inProgress && Date.now() - this.current_action.startTime > this.current_action.timeoutMs) {
          console.warn(`Player ${playerId} action timed out. Performing fallback action.`);
          this.autoPass(playerId);
        }
      }, this.current_action.timeoutMs);
      return true;
    } catch (error) {
      console.error("Failed to begin action:", error);
      this.game_status.lastError = error.message;
      return false;
    }
  }

  autoPass(playerId) {
    // Implement the logic for auto-passing or playing the lowest card
    console.log(`Auto-passing for player ${playerId}`);
    // Example: play the lowest card or pass
    this.completeAction();
  }

  completeAction() {
    try {
      this.current_action = {
        inProgress: false,
        type: null,
        playerId: null,
        startTime: null,
        timeoutMs: 5000
      };
      return true;
    } catch (error) {
      console.error("Failed to complete action:", error);
      this.game_status.lastError = error.message;
      return false;
    }
  }

  rollbackAction() {
    try {
      if (this.last_saved_state) {
        this.restoreGameState();
      }
      this.completeAction();
      return true;
    } catch (error) {
      console.error("Failed to rollback action:", error);
      this.game_status.lastError = error.message;
      return this.handleCriticalError();
    }
  }

  playCard(playerId, card) {
    if (this.state === "Interrupted") {
      return {
        status: "failed",
        reason: "action_in_progress"
      };
    }
    // For testing purposes, return a dummy response
    return {
      status: "failed",
      reason: "action_in_progress"
    };
  }
}

module.exports = GameState;
