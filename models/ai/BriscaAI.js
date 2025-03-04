const GameState = require("../GameState");
const Player = require("../Player") 
const Card = require("../Card")

class BriscaAI {
    constructor(gameState) {
        this.gameState = gameState;
    }

    /**
     * Step 1: Retrieve GameState data relevant to AI
     */
    analyzeGameState() {
        const currentPlayer = this.gameState.getCurrentPlayer();

        // Ensure it's AI's turn before proceeding
        if (!currentPlayer.isAI) {
            console.log("Not AI's turn, skipping...");
            return;
        }

        console.log("AI analyzing game state...");

        // Retrieve necessary game state details
        const trumpSuit = this.gameState.getTrumpSuit();
        const validMoves = this.gameState.getValidMoves(currentPlayer);

        console.log(`Current player: ${currentPlayer.name}`);
        console.log(`Trump suit: ${trumpSuit}`);
        console.log(`Valid moves:`, validMoves);
    }
}

module.exports = BriscaAI;