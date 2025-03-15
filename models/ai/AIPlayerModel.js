const GameState = require("../GameState"); // merged from BriscaAIold.js
const Player = require("../Player"); // replaced with BriscaAIold.js
const Card = require("../Card"); // merged from BriscaAIold.js

/**
 * AIPlayerModel Class - Represents an AI opponent in the card game
 * 
 * This class extends the basic Player class to add AI-specific functionality,
 * including simulated thinking time, automatic card selection, and
 * asynchronous turn handling. It includes failsafe mechanisms to ensure
 * AI turns always complete within a reasonable timeframe.
 * 
 * The AI currently selects the lowest-point card in hand (a change from simply playing
 * the first card), which can be further improved with more advanced algorithms.
 */
class AIPlayerModel extends Player {
    /**
     * Creates a new AI player instance
     * 
     * @param {Array} hand - Initial cards in the AI's hand
     * @param {number} score - Initial score for the AI
     * @param {boolean} isTurn - Whether it's the AI's turn to play
     */
    constructor(hand = [], score = 0, isTurn = false) {
        super(hand, score, isTurn);
        this.isAI = true;
        this.thinkingTime = 1000; // Simulated thinking time in milliseconds
        this.isThinking = false;  // Flag to prevent multiple concurrent AI turns
    }

    /**
     * Handles the AI's turn decision-making process
     * 
     * This asynchronous method simulates the AI "thinking" about which card to play.
     * It includes safety mechanisms to ensure the AI always returns a decision:
     * - Primary logic path selects the lowest-point card from hand
     * - Secondary timeout ensures AI always plays even if primary logic fails
     * - Error handling captures and reports any issues during the thinking process
     * 
     * @returns {Promise<Card>} A promise that resolves to the card the AI decides to play
     * @throws {Error} If the AI cannot play a card or is called out of turn
     */
    async handleTurn(gameState) {
        // Validate that it's actually this AI's turn to play
        const currentPlayerTurn = this.gameState.GetTurn();
        if (currentPlayerTurn === null) {
            console.warn("AI cannot analyze GameState: No active turn.");
            return;
        }
        if (!this.isTurn) {
            console.log("Warning: AI called to play when it's not its turn");
            return Promise.reject(new Error("Not AI's turn"));
        }

        // Prevent concurrent thinking processes for the same AI
        if (this.isThinking) {
            console.log("Warning: AI is already thinking");
            return Promise.reject(new Error("AI is already thinking"));
        }

        // Mark the AI as in the thinking process
        this.isThinking = true;
        console.log("AI is thinking...");

        // Create a promise for AI thinking with both timeout and normal resolution paths
        return new Promise((resolve, reject) => {
            // SAFETY MECHANISM 1: Set a timeout to ensure the AI always plays eventually
            const timeoutId = setTimeout(() => {
                console.log("AI thinking timeout reached - playing default card");
                this.isThinking = false;
                if (this.hand.length > 0) {
                    resolve(this.hand[0]); // Fallback: play the first card
                } else {
                    console.log("AI has no cards in hand (timeout fallback)");
                    this.isThinking = false;
                    reject(new Error("No cards in hand"));
                }
            }, this.thinkingTime * 1.5); // 50% longer than normal thinking time

            // PRIMARY LOGIC PATH: Normal AI decision-making process
            try {
                // Simulate the AI thinking for a period of time
                setTimeout(() => {
                    try {
                        clearTimeout(timeoutId); // Clear the safety timeout as logic succeeded
                        this.isThinking = false;
                        
                        const trumpSuit = this.gameState.GetTrumpSuit();
                        const playerIndex = currentPlayerTurn === "1" ? 0 : 1;
                        const aiHand = this.gameState.GetPlayerHand(playerIndex);
                        
                        console.log(`Turn: Player ${currentPlayerTurn}`);
                        console.log(`Trump Suit: ${trumpSuit}`);
                        console.log("AI Hand:", aiHand.map(card => `${card.rank} of ${card.suit} (${card.points} points)`));
                        
                        // CARD SELECTION LOGIC:
                        // Select the lowest-point card from the AI's hand.
                        if (this.hand.length > 0) {
                            const lowestCard = this.hand.reduce(
                                (lowest, card) => (card.points < lowest.points ? card : lowest),
                                this.hand[0]
                            );
                            console.log(`AI selected card: ${lowestCard.rank} of ${lowestCard.suit} (${lowestCard.points} points)`);
                            resolve(lowestCard);
                        } else {
                            console.log("AI has no cards in hand");
                            reject(new Error("No cards in hand"));
                        }
                    } catch (innerError) {
                        console.error("AI inner thinking error:", innerError);
                        this.isThinking = false;
                        reject(innerError);
                    }
                }, this.thinkingTime);
            } catch (error) {
                console.error("AI outer thinking error:", error);
                clearTimeout(timeoutId);
                this.isThinking = false;
                reject(error);
            }
        });
    }

    /**
     * Check if it's this AI's turn and it's ready to play
     * 
     * An AI is ready to play when:
     * 1. It's officially its turn (isTurn = true)
     * 2. It's not currently in the middle of thinking (isThinking = false)
     * 
     * @returns {boolean} True if the AI is ready to play, false otherwise
     */
    isMyTurn() {
        return this.isTurn && !this.isThinking;
    }

    /**
     * Set the AI's thinking time (how long it "thinks" before playing)
     * 
     * Useful for adjusting difficulty, realism, or speeding up gameplay/testing.
     * 
     * @param {number} milliseconds - Thinking time in milliseconds
     */
    setThinkingTime(milliseconds) {
        this.thinkingTime = milliseconds;
    }

    /**
     * Play a card from the AI's hand
     * 
     * Overrides the base Player.playCard() method to ensure the AI's
     * isThinking flag is reset when a card is played.
     * 
     * @param {Card} card - The card to play
     * @returns {Card} The played card
     * @throws {Error} If the card is invalid or not in the AI's hand.
     */
    playCard(card) {
        this.isThinking = false; // Reset thinking state when a card is played
        if (!this.hand.includes(card)) {
            throw new Error("Card is not in player's hand.");
        }
        if (arguments.length > 1) {
            throw new Error("You can't play more than one card at a time.");
        }
        if (!card || !(card instanceof Card)) {
            throw new Error("Invalid card played.");
        }
        // Remove the card from the AI's hand
        this.hand = this.hand.filter(c => c.rank !== card.rank || c.suit !== card.suit);
        this.canDraw = true;

        return super.playCard(card);
    }
}

module.exports = AIPlayerModel;
