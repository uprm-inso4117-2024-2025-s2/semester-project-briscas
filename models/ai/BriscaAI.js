const GameState = require("../GameState");
const Player = require("../Player");
const Card = require("../Card");

class BriscaAI {
  constructor(gameState) { this.gameState = gameState; }

  /**
   * Step 1: Retrieve and validate GameState information
   */
  analyzeGameState() {
    const currentPlayerTurn = this.gameState.GetTurn();

    if (currentPlayerTurn === null) {
      console.warn("AI cannot analyze GameState: No active turn.");
      return;
    }

    console.log("AI analyzing game state...");

    const trumpSuit = this.gameState.GetTrumpSuit();
    const playerIndex = currentPlayerTurn === "1" ? 0 : 1;
    const aiHand = this.gameState.GetPlayerHand(playerIndex);

    console.log(`Turn: Player ${currentPlayerTurn}`);
    console.log(`Trump Suit: ${trumpSuit}`);
    console.log("AI Hand:", aiHand.map(card => `${card.rank} of ${card.suit} (${
                                           card.points} points)`));
  }

  makeMove() {
    const currentPlayerTurn = this.gameState.GetTurn();
    if (currentPlayerTurn === null) {
      console.warn("AI cannot move: No active turn.");
      return null;
    }

    const playerIndex = currentPlayerTurn === "1" ? 0 : 1;
    const aiHand = this.gameState.GetPlayerHand(playerIndex);

    if (!aiHand || aiHand.length === 0) {
      console.warn("AI has no cards to play.");
      return null;
    }

    // Prioritize playing the lowest-ranked card
    const lowestCard = aiHand.reduce(
        (lowest,
         card) => { return card.points < lowest.points ? card : lowest; },
        aiHand[0]);

    console.log(`AI (Easy Mode) chooses to play: ${lowestCard.rank} of ${
        lowestCard.suit} (${lowestCard.points} points)`);

    this.gameState.playCard(playerIndex, lowestCard);
    return lowestCard;
  }
}
module.exports = BriscaAI;
