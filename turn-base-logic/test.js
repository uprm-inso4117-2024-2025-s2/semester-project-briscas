// test.js
import assert from 'assert';
import { RoundManager } from './round-manager.js';
import { Player} from './turn-manager.js';

// Helper function to create a simple card object.
function createCard(id, name) {
  return { id, name };
}

// Create sample cards.
const card1 = createCard(1, 'Ace of Spades');
const card2 = createCard(2, 'King of Hearts');

// Create sample players with one card each.
const player1 = new Player(1, 'Alice', [card1]);
const player2 = new Player(2, 'Bob', [card2]);

// Create a RoundManager instance with the two players.
const roundManager = new RoundManager([player1, player2]);
roundManager.startRound();

// Test 1: Ensure the current player is either Alice or Bob.
const currentPlayer = roundManager.turnManager.getCurrentPlayer();
console.log('Initial turn:', currentPlayer.name);
assert(
  currentPlayer === player1 || currentPlayer === player2,
  'Current player must be either Alice or Bob.'
);

// Test 2: Simulate a move by the current player using their card.
const currentCard = currentPlayer.hand[0];
roundManager.playMove(currentPlayer, currentCard);

// Verify that the card is removed from the player's hand.
assert(
  !currentPlayer.hasCard(currentCard),
  'Card should be removed from the player\'s hand after playing.'
);
assert(
  roundManager.roundMoves.length === 1,
  'One move should have been recorded.'
);

// Test 3: Simulate a move by the other player.
const otherPlayer = roundManager.turnManager.getCurrentPlayer();
const otherCard = otherPlayer.hand[0];
roundManager.playMove(otherPlayer, otherCard);

// Verify that the round is now complete.
assert(
  roundManager.isRoundComplete(),
  'Round should be complete after both players have played.'
);

console.log('All tests passed.');
