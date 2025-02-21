// FinalScoreManager.js

const Player = require('./Player');
const Card = require('./Card');
const Deck = require('./Deck');
const GameState = require('./GameState');
const Winner = require('./Winner');

class RoundManager {
  constructor(trumpSuit) {
    this.trumpSuit = trumpSuit;
    this.playedCards = {}; // { player1: Card, player2: Card }
    this.scores = { player1: 0, player2: 0 };
  }

  playCard(player, card) {
    if (!card || !(card instanceof Card)) {
      throw new Error("Invalid card played.");
    }
    this.playedCards[player] = card;
  }

  determineWinner() {
    const { player1, player2 } = this.playedCards;
    if (!player1 || !player2) {
      throw new Error("Both players must play a card before determining the winner.");
    }

    let winner;
    if (player1.beats(player2, this.trumpSuit)) {
      winner = "player1";
    } else {
      winner = "player2";
    }

    this.updateScore(winner);
    this.resetRound();
    return winner;
  }

  updateScore(winner) {
    const roundPoints = this.playedCards.player1.points + this.playedCards.player2.points;
    this.scores[winner] += roundPoints;
  }

  resetRound() {
    this.playedCards = {}; // Reset played cards for the next round
  }
}

class FinalScoreManager {
  constructor(gameState, uiCallback, trumpSuit) {
    this.gameState = gameState;
    this.players = gameState.players;
    this.uiCallback = uiCallback; // Function to send data to the UI
    this.roundManager = new RoundManager(trumpSuit);
    this.winner = null;
  }

  playRound(player, card) {
    this.roundManager.playCard(player, card);
    if (Object.keys(this.roundManager.playedCards).length === this.players.length) {
      const roundWinnerKey = this.roundManager.determineWinner();
      const roundWinner = this.players.find((p) => p.name === roundWinnerKey);
      roundWinner.roundsWon += 1;
    }
  }

  calculateTotalScores() {
    this.players.forEach((player) => {
      const totalPoints = player.collectedCards.reduce((acc, card) => acc + card.points, 0);
      player.totalScore = totalPoints + (player.roundsWon * 10); // Example extra scoring per round win
    });
  }

  determineWinner() {
    let highestScore = -1;
    let winner = null;

    this.players.forEach((player) => {
      if (player.totalScore > highestScore) {
        highestScore = player.totalScore;
        winner = player;
      }
    });

    this.winner = new Winner(winner.name, winner.totalScore);
    return this.winner;
  }

  finalizeGame() {
    this.calculateTotalScores();
    const winner = this.determineWinner();
    this.sendFinalDataToUI();
    return winner;
  }

  sendFinalDataToUI() {
    if (typeof this.uiCallback === 'function') {
      this.uiCallback({
        players: this.players.map((p) => ({ name: p.name, score: p.totalScore, roundsWon: p.roundsWon })),
        winner: { name: this.winner.name, score: this.winner.score }
      });
    }
  }

  resetGame() {
    this.players.forEach((player) => {
      player.reset();
      player.roundsWon = 0;
    });
    this.winner = null;
    this.gameState.reset();
    this.roundManager = new RoundManager(this.roundManager.trumpSuit);
  }

  validateScores() {
    const totalCollectedCards = this.players.reduce((acc, player) => acc + player.collectedCards.length, 0);
    if (totalCollectedCards !== Deck.TOTAL_CARDS) {
      throw new Error('Not all cards have been collected. Check the deck or gameplay.');
    }
  }

  handleUnexpectedEnd() {
    try {
      this.validateScores();
      return this.finalizeGame();
    } catch (error) {
      console.error('Game ended unexpectedly:', error);
      return null;
    }
  }
}

// Example Test Cases
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
  console.log('All tests passed.');

  console.log('Testing Reset Functionality...');
  manager.resetGame();
  console.assert(player1.totalScore === 0 && player1.collectedCards.length === 0 && player1.roundsWon === 0, 'Reset failed for Player 1');
  console.assert(player2.totalScore === 0 && player2.collectedCards.length === 0 && player2.roundsWon === 0, 'Reset failed for Player 2');
  console.log('Reset functionality works as expected.');
}

runTestCases();

module.exports = FinalScoreManager;

