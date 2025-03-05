const Player = require('./Player');

/**
 * AIPlayer Class - Represents an AI opponent in the card game
 * 
 * This class extends the basic Player class to add AI-specific functionality,
 * including simulated thinking time, automatic card selection, and
 * asynchronous turn handling. It includes failsafe mechanisms to ensure
 * AI turns always complete within a reasonable timeframe.
 * 
 * The AI currently uses a simple strategy (playing the first card in hand),
 * but this can be enhanced with more sophisticated algorithms in the future.
 */
class AIPlayer extends Player {
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
     * - Primary logic path attempts to select the best card based on game state
     * - Secondary timeout ensures AI always plays even if primary logic fails
     * - Error handling captures and reports any issues during the thinking process
     * 
     * @param {Object} gameState - Current game state with information about played cards and game rules
     * @returns {Promise<Card>} A promise that resolves to the card the AI decides to play
     * @throws {Error} If the AI cannot play a card or is called out of turn
     */
    async handleTurn(gameState) {
        // Validate that it's actually this AI's turn to play
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
            // This prevents the game from getting stuck if the AI logic takes too long
            const timeoutId = setTimeout(() => {
                // If we're hitting the timeout, just play the first available card as a fallback
                console.log("AI thinking timeout reached - playing default card");
                this.isThinking = false;
                
                if (this.hand.length > 0) {
                    resolve(this.hand[0]); // Play first card as fallback
                } else {
                    console.log("AI has no cards in hand (timeout fallback)");
                    this.isThinking = false;
                    reject(new Error("No cards in hand"));
                }
            }, this.thinkingTime * 1.5); // Use 50% longer than normal thinking time for the safety timeout

            // PRIMARY LOGIC PATH: Normal AI decision-making process
            try {
                // Simulate the AI thinking for a period of time
                setTimeout(() => {
                    try {
                        clearTimeout(timeoutId); // Clear the safety timeout since normal logic succeeded
                        this.isThinking = false;
                        
                        // CARD SELECTION LOGIC
                        // For now, just play the first card in hand (basic strategy)
                        // TODO: Implement more sophisticated card selection algorithm based on gameState
                        if (this.hand.length > 0) {
                            console.log(`AI selected card: ${this.hand[0].rank}${this.hand[0].suit}`);
                            resolve(this.hand[0]);
                        } else {
                            console.log("AI has no cards in hand");
                            reject(new Error("No cards in hand"));
                        }
                    } catch (innerError) {
                        // Handle errors that occur during card selection
                        console.error("AI inner thinking error:", innerError);
                        this.isThinking = false;
                        reject(innerError);
                    }
                }, this.thinkingTime);
            } catch (error) {
                // Handle errors in the setTimeout setup (rare but possible)
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
     * This can be useful for:
     * - Adjusting difficulty (faster/slower AI)
     * - Creating a more realistic feel by varying thinking time
     * - Speeding up gameplay or tests as needed
     * 
     * @param {number} milliseconds - Thinking time in milliseconds
     */
    setThinkingTime(milliseconds) {
        this.thinkingTime = milliseconds;
    }

    /**
     * Play a card from the AI's hand
     * 
     * This overrides the base Player.playCard() method to ensure
     * the AI's isThinking flag is reset when a card is played.
     * 
     * @param {Card} card - The card to play
     * @returns {Card} The played card
     */
    playCard(card) {
        this.isThinking = false; // Reset thinking state when a card is played
        return super.playCard(card);
    }
}

module.exports = AIPlayer; 