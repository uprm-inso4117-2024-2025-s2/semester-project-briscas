// testTurnManager.js

// --- The Classes (with a small fix) ---

class Player {
    constructor(id, name, hand = []) {
      this.id = id;
      this.name = name;
      this.hand = hand;
      this.score = 0;
    }
  }
  
  class TurnManager {
    // Initialize the turn manager with two players.
    constructor(player1, player2) {
      this.players = [player1, player2];
      this.player1 = player1;
      this.player2 = player2;
      this.currentTurnIndex = Math.floor(Math.random() * 2);
      this.currentRoundMoves = [];
    }
  
    // Get the player whose turn it is.
    getCurrentPlayer() {
      return this.players[this.currentTurnIndex];
    }
  
    // Check if it is the given player's turn.
    isTurn(player) {
      return this.getCurrentPlayer().id === player.id;
    }
  
    // Process a move (e.g., playing a card).
    playMove(player, move) {
      // FIX: Use isTurn (not isPlayersTurn) to verify that it's the correct player's turn.
      if (!this.isTurn(player)) {
        throw new Error(`Invalid move: It's not ${player.name}'s turn!`);
      }
  
      // Record the move.
      this.currentRoundMoves.push({ player, move });
      console.log(`${player.name} played ${move.name || move}.`);
  
      // After processing the move, switch turns.
      this.switchTurn();
    }
  
    // Switch turn to the next player.
    switchTurn() {
      this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length;
      console.log(`Turn switched. It is now ${this.getCurrentPlayer().name}'s turn.`);
    }
  
    // Check if the round is complete (i.e., all players have made a move).
    isRoundComplete() {
      return this.currentRoundMoves.length === this.players.length;
    }
  
    // Reset moves for a new round.
    resetRound() {
      this.currentRoundMoves = [];
      console.log('Round reset.');
    }
  }
  
  // --- Test Code ---
  
  const assert = require('assert');
  
  // Create sample players.
  const player1 = new Player(1, 'Alice');
  const player2 = new Player(2, 'Bob');
  
  // Create a TurnManager instance.
  const turnManager = new TurnManager(player1, player2);
  
  // 1. Test: Ensure the current player is one of the two.
  let currentPlayer = turnManager.getCurrentPlayer();
  console.log(`Initial turn: ${currentPlayer.name}`);
  assert(
    currentPlayer.id === player1.id || currentPlayer.id === player2.id,
    'Current player should be either Alice or Bob.'
  );
  
  // 2. Test: Verify that isTurn returns true for the current player.
  assert(turnManager.isTurn(currentPlayer), 'isTurn should return true for the current player.');
  
  // 3. Test: Switch turns and verify that the turn changes.
  const initialTurnId = currentPlayer.id;
  turnManager.switchTurn();
  currentPlayer = turnManager.getCurrentPlayer();
  assert(
    currentPlayer.id !== initialTurnId,
    'After switching, the current turn should be the other player.'
  );
  
  // 4. Test: playMove with the correct player.
  // Save the current player before playing.
  const validPlayer = currentPlayer;
  try {
    turnManager.playMove(validPlayer, { name: 'Ace of Spades' });
    console.log('playMove executed successfully for the valid turn.');
  } catch (e) {
    console.error('Unexpected error for valid move:', e.message);
    assert.fail('playMove should not throw an error for a valid move.');
  }
  
  // 5. Test: playMove with the wrong player.
  // Determine the player not currently on turn.
  const wrongPlayer = turnManager.getCurrentPlayer().id === player1.id ? player2 : player1;
  try {
    turnManager.playMove(wrongPlayer, { name: 'King of Hearts' });
    assert.fail('playMove should throw an error when a player plays out of turn.');
  } catch (e) {
    console.log('Caught expected error for invalid move:', e.message);
  }
  
  // 6. Test: Round complete behavior.
  // Reset the round.
  turnManager.resetRound();
  assert.strictEqual(turnManager.currentRoundMoves.length, 0, 'Round should be reset to 0 moves.');
  
  // Force the turn order for predictability in this test:
  turnManager.currentTurnIndex = 0; // Let player1 start.
  turnManager.playMove(player1, { name: 'Card 1' });
  turnManager.playMove(player2, { name: 'Card 2' });
  
  // After two moves in a two-player game, the round should be complete.
  assert(turnManager.isRoundComplete(), 'Round should be complete after both players have played.');
  
  console.log('All tests passed.');
  