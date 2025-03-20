const AIPlayerModel = require("./AIPlayerModel");

/**
 * AINormal Class - Medium Mode AI.
 *
 * Implements a balanced approach:
 * - Considers the opponent’s card if already played.
 * - Uses trump cards tactically, but not aggressively.
 * - Plays mid-range cards when leading to avoid wasting strong cards.
 */
class AINormal extends AIPlayerModel {
  selectCard() {
    const trumpSuit = this.gameState.GetTrumpSuit();
    const currentPlayerTurn = this.gameState.GetTurn();
    const playerIndex = currentPlayerTurn === "1" ? 0 : 1;

    // Retrieve the opponent's played card (if any).
    let opponentCard =
      playerIndex === 0
        ? this.gameState.GetPlayedCards(1)
        : this.gameState.GetPlayedCards(0);

    let chosenCard;

    if (opponentCard) {
      if (opponentCard.suit === trumpSuit) {
        // Opponent played a trump card, try to counter.
        const higherTrump = this.hand.filter(
          (card) => card.suit === trumpSuit && card.points > opponentCard.points
        );
        if (higherTrump.length > 0) {
          chosenCard = higherTrump.reduce(
            (min, card) => (card.points < min.points ? card : min),
            higherTrump[0]
          );
        } else {
          // No winning trump, play a low-value non-trump card if possible.
          const nonTrumpCards = this.hand.filter(
            (card) => card.suit !== trumpSuit
          );
          chosenCard =
            nonTrumpCards.length > 0
              ? nonTrumpCards.reduce(
                  (low, card) => (card.points < low.points ? card : low),
                  nonTrumpCards[0]
                )
              : this.hand.reduce(
                  (low, card) => (card.points < low.points ? card : low),
                  this.hand[0]
                );
        }
      } else {
        // Opponent played a non-trump card → AI should play a trump if possible
        const trumpCards = this.hand.filter((card) => card.suit === trumpSuit);
        if (trumpCards.length > 0) {
          // Ensure AI picks the lowest trump card
          chosenCard = trumpCards.reduce(
            (lowest, card) => (card.points < lowest.points ? card : lowest),
            trumpCards[0]
          );
        } else {
          // If no trump available, try to win with a higher card
          const winningOptions = this.hand.filter(
            (card) =>
              card.suit === opponentCard.suit &&
              card.points > opponentCard.points
          );
          if (winningOptions.length > 0) {
            chosenCard = winningOptions.reduce(
              (min, card) => (card.points < min.points ? card : min),
              winningOptions[0]
            );
          } else {
            // No winning move: play the lowest-value card.
            chosenCard = this.hand.reduce(
              (low, card) => (card.points < low.points ? card : low),
              this.hand[0]
            );
          }
        }
      }
    } else {
      // AI is leading: Play a middle-value non-trump card if available
      const nonTrumpCards = this.hand.filter((card) => card.suit !== trumpSuit);
      if (nonTrumpCards.length > 0) {
        chosenCard = nonTrumpCards.reduce(
          (mid, card) =>
            Math.abs(card.points - 5) < Math.abs(mid.points - 5) ? card : mid,
          nonTrumpCards[0]
        );
      } else {
        // No non-trump cards, play the lowest trump.
        chosenCard = this.hand.reduce(
          (low, card) => (card.points < low.points ? card : low),
          this.hand[0]
        );
      }
    }

    if (!chosenCard) {
      throw new Error("No card selected in Normal mode");
    }
    return chosenCard;
  }
}

module.exports = AINormal;
