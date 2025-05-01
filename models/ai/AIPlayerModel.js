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

    /**
     * Number of milliseconds the AI will "think"
     * before attempting to pick a card.
     */
    this.thinkingTime = 1000;

    /**
     * Flag indicating whether the AI is currently in the "thinking" process.
     * This prevents multiple concurrent calls from interfering with each other.
     */
    this.isThinking = false;

    /**
     * Reference to the active game state for the AI to query (turn checks,
     * etc.).
     */
    this.gameState = gameState;
  }

  /**
   * Abstract method: selectCard.
   * Subclasses must override this method to implement their card selection
   * logic.
   * @returns {Card} The card selected to play.
   */
  selectCard() {
    throw new Error("selectCard() must be implemented by subclass.");
  }

  /**
   * Executes the AI’s thinking and card-selection process.
   *
   * Preconditions:
   * - It must be the AI’s turn (isTurn === true).
   * - AI must not already be thinking.
   *
   * Postconditions:
   * - Returns a Card selected using `selectCard()`.
   * - Fallback triggers if selection fails or times out.
   *
   * @returns {Promise<Card>} Resolves with the selected card or fallback.
   */
  async handleTurn() {
    // 1) Make sure the gameState has an active turn.
    const currentPlayerTurn = this.gameState.GetTurn();
    if (currentPlayerTurn === null) {
      console.warn("AI cannot analyze GameState: No active turn.");
      return;
    }

    // 2) Confirm it's actually the AI's turn. If not, reject the Promise.
    if (!this.isTurn) {
      console.log("Warning: AI called to play when it's not its turn");
      return Promise.reject(new Error("Not AI's turn"));
    }

    // 3) Check if the AI is already in the middle of a thinking process.
    if (this.isThinking) {
      console.log("Warning: AI is already thinking");
      return Promise.reject(new Error("AI is already thinking"));
    }

    // Mark that the AI is now actively thinking.
    this.isThinking = true;
    console.log("AI is thinking...");

    // 4) Return a Promise that will resolve or reject once a card is chosen
    //    or the safety net fallback triggers.
    return new Promise((resolve, reject) => {
      // Fallback timer that forces the AI to play something if
      // we haven't finished the main logic in time.
      const timeoutId = setTimeout(() => {
        console.log("AI thinking timeout reached - playing default card");
        this.isThinking = false;

        // If the AI still has cards, pick the first card as fallback.
        if (this.hand.length > 0) {
          resolve(this.hand[0]);
        } else {
          // If the AI has no cards, reject with an error.
          console.log("AI has no cards in hand (timeout fallback)");
          reject(new Error("No cards in hand"));
        }
      }, this.thinkingTime * 1.5);

      // Main thinking timer. Once this expires, we attempt to select a card
      // using the AI's selection logic (selectCard()).
      setTimeout(() => {
        try {
          // Cancel the fallback so it doesn’t trigger after a successful pick.
          clearTimeout(timeoutId);

          // AI has finished "thinking" now.
          this.isThinking = false;

          // 5) Call selectCard() to retrieve the AI's chosen card.
          const selectedCard = this.selectCard();
          if (selectedCard) {
            console.log(`AI selected card: ${selectedCard.rank} of ${
                selectedCard.suit} (${selectedCard.points} points)`);
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

  /**
   * isMyTurn()
   * ----------
   * Utility to check if it is this AI's turn and it's not currently "thinking."
   * @returns {boolean}
   */
  isMyTurn() { return this.isTurn && !this.isThinking; }

  /**
   * setThinkingTime(milliseconds)
   * ----------------------------
   * Allows dynamic configuration of how long the AI waits before playing.
   * @param {number} milliseconds - The new thinking time in milliseconds.
   */
  setThinkingTime(milliseconds) { this.thinkingTime = milliseconds; }

  /**
   * Plays a card from the AI's hand.
   * Overrides Player.playCard() to reset the thinking flag and update the hand.
   *
   * @param {Card} card - The card to play.
   * @returns {Card} The played card.
   */
  playCard(card) {
    // Ensure the AI is no longer in a thinking state once we actually play a
    // card.
    this.isThinking = false;

    // If the specified card isn't actually in the AI’s hand, error out.
    if (!this.hand.includes(card)) {
      throw new Error("Card is not in player's hand.");
    }

    // The AI must only play exactly one card at a time.
    if (arguments.length > 1) {
      throw new Error("You can't play more than one card at a time.");
    }

    // Validate the card is a Card instance.
    if (!card || !(card instanceof Card)) {
      throw new Error("Invalid card played.");
    }

    // Remove the played card from the hand, allowing the AI to draw again.
    this.hand =
        this.hand.filter(c => c.rank !== card.rank || c.suit !== card.suit);
    this.canDraw = true;
    return super.playCard(card);
  }
}

module.exports = AIPlayerModel;
