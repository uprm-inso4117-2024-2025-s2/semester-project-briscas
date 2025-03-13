const AIPlayerModel = require("./AIPlayerModel");

/**
 * AIHard Class - Hard Mode AI.
 *
 * Implements a strategic approach:
 * - Evaluates the opponent's card and the trump suit.
 * - Aggressively plays trump cards when advantageous.
 * - Optimizes its move based on game state to maximize win potential.
 */
class AIHard extends AIPlayerModel {
    selectCard() {
        const trumpSuit = this.gameState.GetTrumpSuit();
        const currentPlayerTurn = this.gameState.GetTurn();
        const playerIndex = currentPlayerTurn === "1" ? 0 : 1;
        // Retrieve the opponent's played card (if any).
        let opponentCard = (playerIndex === 0)
            ? this.gameState.GetPlayedCards(1)
            : this.gameState.GetPlayedCards(0);
        let chosenCard;
        if (opponentCard) {
            if (opponentCard.suit === trumpSuit) {
                // Opponent played a trump card.
                const winningTrump = this.hand.filter(card =>
                    card.suit === trumpSuit && card.points > opponentCard.points
                );
                if (winningTrump.length > 0) {
                    chosenCard = winningTrump.reduce((min, card) =>
                        card.points < min.points ? card : min,
                        winningTrump[0]
                    );
                } else {
                    // Cannot beat the trump: sacrifice the lowest non-trump card if possible.
                    const nonTrumpCards = this.hand.filter(card => card.suit !== trumpSuit);
                    if (nonTrumpCards.length > 0) {
                        chosenCard = nonTrumpCards.reduce((lowest, card) =>
                            card.points < lowest.points ? card : lowest,
                            nonTrumpCards[0]
                        );
                    } else {
                        // Only trump cards available; play the lowest trump.
                        chosenCard = this.hand.reduce((lowest, card) =>
                            card.points < lowest.points ? card : lowest,
                            this.hand[0]
                        );
                    }
                }
            } else {
                // Opponent did not play trump.
                const trumpCards = this.hand.filter(card => card.suit === trumpSuit);
                if (trumpCards.length > 0) {
                    // Aggressively use a trump card.
                    chosenCard = trumpCards.reduce((min, card) =>
                        card.points < min.points ? card : min,
                        trumpCards[0]
                    );
                } else {
                    // Try to beat the opponent with a higher card.
                    const winningOptions = this.hand.filter(card => card.points > opponentCard.points);
                    if (winningOptions.length > 0) {
                        chosenCard = winningOptions.reduce((min, card) =>
                            card.points < min.points ? card : min,
                            winningOptions[0]
                        );
                    } else {
                        // No winning move: play the lowest-value card.
                        chosenCard = this.hand.reduce((lowest, card) =>
                            card.points < lowest.points ? card : lowest,
                            this.hand[0]
                        );
                    }
                }
            }
        } else {
            // When leading: prefer the highest non-trump card to maximize win potential,
            // or if only trump cards exist, play the lowest trump.
            const nonTrumpCards = this.hand.filter(card => card.suit !== trumpSuit);
            if (nonTrumpCards.length > 0) {
                chosenCard = nonTrumpCards.reduce((highest, card) =>
                    card.points > highest.points ? card : highest,
                    nonTrumpCards[0]
                );
            } else {
                chosenCard = this.hand.reduce((lowest, card) =>
                    card.points < lowest.points ? card : lowest,
                    this.hand[0]
                );
            }
        }
        if (!chosenCard) {
            throw new Error("No card selected in Hard mode");
        }
        return chosenCard;
    }
}

module.exports = AIHard;
