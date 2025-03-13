const AIPlayerModel = require("./AIPlayerModel");

/**
 * AIEasy Class - Easy Mode AI.
 *
 * Implements a simple strategy:
 * - Ignores opponent actions.
 * - Always plays the lowest-value card.
 */
class AIEasy extends AIPlayerModel {
    selectCard() {
        if (this.hand.length > 0) {
            // Select the card with the lowest point value.
            return this.hand.reduce((lowest, card) =>
                card.points < lowest.points ? card : lowest,
                this.hand[0]
            );
        }
        throw new Error("No cards in hand");
    }
}

module.exports = AIEasy;
