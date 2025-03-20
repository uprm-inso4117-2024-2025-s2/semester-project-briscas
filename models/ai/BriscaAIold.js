const GameState = require("../GameState");//merged
const Player = require("../Player"); //already there
const Card = require("../Card");//merged

class BriscaAIold {
    constructor(gameState) {
        this.gameState = gameState; //merged into AIPlayerold's constructor
    }

    /**
     * Step 1: Retrieve and validate GameState information
     */
    //old comments ommited due to new structure
    analyzeGameState() {
        const currentPlayerTurn = this.gameState.GetTurn(); //merged

        if (currentPlayerTurn === null) { //merged
            console.warn("AI cannot analyze GameState: No active turn.");//merged
            return;//merged
        }//merged

        console.log("AI analyzing game state..."); //replaced
        
        const trumpSuit = this.gameState.GetTrumpSuit();//merged
        const playerIndex = currentPlayerTurn === "1" ? 0 : 1;//merged
        const aiHand = this.gameState.GetPlayerHand(playerIndex);//merged

        console.log(`Turn: Player ${currentPlayerTurn}`);//merged
        console.log(`Trump Suit: ${trumpSuit}`);//merged
        console.log("AI Hand:", aiHand.map(card => `${card.rank} of ${card.suit} (${card.points} points)`));//merged

    }
}

module.exports = BriscaAIold;
