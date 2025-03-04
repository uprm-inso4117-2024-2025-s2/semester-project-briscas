const GameState = require("../GameState");
const Player = require("../Player");
const Card = require("../Card");

class BriscaAI {
    constructor(gameState) {
        this.gameState = gameState;
    }

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
        console.log("AI Hand:", aiHand.map(card => `${card.rank} of ${card.suit} (${card.points} points)`));

    }
}

module.exports = BriscaAI;
