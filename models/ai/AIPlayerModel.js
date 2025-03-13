const GameState = require("../GameState");
const Player = require("../Player");
const Card = require("../Card");

/**
 * AIPlayerModel Class - Abstract/general purpose AI opponent.
 *
 * This class extends Player to add AI-specific functionality such as simulated
 * thinking time, automatic card selection, and asynchronous turn handling.
 * Subclasses must implement the selectCard() method.
 */
class AIPlayerModel extends Player {
    /**
     * @param {Object} gameState - The current game state.
     * @param {Array} hand - Initial cards in the AI's hand.
     * @param {number} score - Initial score for the AI.
     * @param {boolean} isTurn - Whether it's the AI's turn to play.
     */
    constructor(gameState, hand = [], score = 0, isTurn = false) {
        super(hand, score, isTurn);
        this.isAI = true;
        this.thinkingTime = 1000; // in milliseconds
        this.isThinking = false;
        this.gameState = gameState;
    }

    /**
     * Abstract method: selectCard
     * Subclasses must override this method to implement their card selection logic.
     * @returns {Card} The card selected to play.
     */
    selectCard() {
        throw new Error("selectCard() must be implemented by subclass.");
    }

    /**
     * Handles the AI's turn decision-making process.
     * It simulates thinking time and then calls selectCard() to determine the move.
     * A failsafe timeout guarantees a move is made.
     *
     * @returns {Promise<Card>} A promise that resolves to the selected card.
     */
    async handleTurn() {
        const currentPlayerTurn = this.gameState.GetTurn();
        if (currentPlayerTurn === null) {
            console.warn("AI cannot analyze GameState: No active turn.");
            return;
        }
        if (!this.isTurn) {
            console.log("Warning: AI called to play when it's not its turn");
            return Promise.reject(new Error("Not AI's turn"));
        }
        if (this.isThinking) {
            console.log("Warning: AI is already thinking");
            return Promise.reject(new Error("AI is already thinking"));
        }
        this.isThinking = true;
        console.log("AI is thinking...");

        return new Promise((resolve, reject) => {
            // Safety timeout to guarantee a move is made.
            const timeoutId = setTimeout(() => {
                console.log("AI thinking timeout reached - playing default card");
                this.isThinking = false;
                if (this.hand.length > 0) {
                    resolve(this.hand[0]); // Fallback: first card in hand.
                } else {
                    console.log("AI has no cards in hand (timeout fallback)");
                    this.isThinking = false;
                    reject(new Error("No cards in hand"));
                }
            }, this.thinkingTime * 1.5);

            setTimeout(() => {
                try {
                    clearTimeout(timeoutId);
                    this.isThinking = false;
                    const selectedCard = this.selectCard();
                    if (selectedCard) {
                        console.log(`AI selected card: ${selectedCard.rank} of ${selectedCard.suit} (${selectedCard.points} points)`);
                        resolve(selectedCard);
                    } else {
                        reject(new Error("selectCard() did not return a card."));
                    }
                } catch (error) {
                    console.error("Error during card selection:", error);
                    this.isThinking = false;
                    reject(error);
                }
            }, this.thinkingTime);
        });
    }

    isMyTurn() {
        return this.isTurn && !this.isThinking;
    }

    setThinkingTime(milliseconds) {
        this.thinkingTime = milliseconds;
    }

    /**
     * Plays a card from the AI's hand.
     * Overrides Player.playCard() to reset the thinking flag and update the hand.
     *
     * @param {Card} card - The card to play.
     * @returns {Card} The played card.
     */
    playCard(card) {
        this.isThinking = false; // Reset thinking state on play.
        if (!this.hand.includes(card)) {
            throw new Error("Card is not in player's hand.");
        }
        if (arguments.length > 1) {
            throw new Error("You can't play more than one card at a time.");
        }
        if (!card || !(card instanceof Card)) {
            throw new Error("Invalid card played.");
        }
        // Remove the played card from the AI's hand.
        this.hand = this.hand.filter(c => c.rank !== card.rank || c.suit !== card.suit);
        this.canDraw = true;
        return super.playCard(card);
    }
}

module.exports = AIPlayerModel;
