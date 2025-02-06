const Card = require("./Card");

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
      throw new Error(
        "Both players must play a card before determining the winner."
      );
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
    const roundPoints =
      this.playedCards.player1.points + this.playedCards.player2.points;
    this.scores[winner] += roundPoints;
  }

  resetRound() {
    this.playedCards = {}; // Reset played cards for the next round
  }

  getRoundWinnerData() {
    return {
      winner: this.determineWinner(),
      scores: this.scores,
    };
  }
}

// Export the RoundManager class for use in the game
module.exports = RoundManager;
