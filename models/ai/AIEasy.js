const AIPlayerModel = require("./AIPlayerModel");

/**
 * AIEasy Class - Easy Mode AI.
 *
 * Implements a simple strategy:
 * - Ignores opponent actions.
 * - Always plays the lowest-value card.
 */
class AIEasy extends AIPlayerModel {
  /**
   * @param {Object} gameState - The current game state.
   * @param {Array} hand - Initial cards in the AI's hand.
   * @param {number} score - Initial score for the AI.
   * @param {boolean} isTurn - Whether it's the AI's turn to play.
   */
  constructor(gameState, hand = [], score = 0, isTurn = false) {
    super(gameState, hand, score, isTurn);
  }

  selectCard() {
    if (this.hand.length > 0) {
      // Always select the card with the lowest point value.
      return this.hand.reduce((lowest, card) =>
                                  card.points < lowest.points ? card : lowest,
                              this.hand[0]);
    }
    throw new Error("No cards in hand");
  }
}

module.exports = AIEasy;
