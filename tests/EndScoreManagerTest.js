const Player = require('../models/Player');
const Card = require('../models/Card');
const Deck = require('../models/Deck');
const GameState = require('../models/GameState');
const FinalScoreManager = require('../models/EndScoreManager');

function runTestCases() {
  const mockUICallback = (data) => console.log('UI Data:', data);

  const player1 = new Player('Player 1');
  const player2 = new Player('Player 2');

  const gameState = new GameState([player1, player2], new Deck());
  const manager = new FinalScoreManager(gameState, mockUICallback, 'hearts');

  console.log('Running Round and Final Score Calculation Test...');
  manager.playRound('Player 1', new Card('hearts', 'A'));
  manager.playRound('Player 2', new Card('clubs', '3'));

  manager.finalizeGame();
  console.assert(manager.winner !== null, 'Winner determination failed');
  console.assert(manager.winner.name === player1.name, 'Incorrect winner determined');
  console.log('Round and Final Score Calculation Test passed.');

  console.log('Testing Reset Functionality...');
  manager.resetGame();
  console.assert(player1.totalScore === 0 && player1.collectedCards.length === 0 && player1.roundsWon === 0, 'Reset failed for Player 1');
  console.assert(player2.totalScore === 0 && player2.collectedCards.length === 0 && player2.roundsWon === 0, 'Reset failed for Player 2');
  console.log('Reset functionality works as expected.');
}
if (require.main === module) {
	runTestCases();
}

module.exports = runTestCases;
