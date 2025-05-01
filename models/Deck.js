const Card = require('./Card');

class Deck {
  constructor() {
    this.deck = [];        // Stores the 40 unique cards
    this.trumpSuit = null; // Stores Trump suit
    this.trumpCard = null; // Stores Trump card
    this.initializeDeck(); // Generate the deck
  }
  // Getters and Setters
  //  Get the trump suit
  getTrumpSuit() { return this.trumpSuit; }

  // Get the trump card
  getTrumpCard() { return this.trumpCard; }

  // Check deck size
  getDeckSize() { return this.deck.length; }

  // Draws a card
  getCard() { return this.deck.pop(); }

  // Set up the trump suit
  setupTrumpSuit() {
    if (!this.trumpCard) {
      this.trumpCard = this.getCard();
      this.trumpSuit = this.trumpCard.suit;
    }
    return this.trumpCard;
  }

  // Functions

  // Initialize the deck by creating 40 unique cards
  initializeDeck() {
    const suits = [ "Oros", "Copas", "Espadas", "Bastos" ];
    const ranks = [ "1", "2", "3", "4", "5", "6", "7", "10", "11", "12" ];

    this.deck = suits.flatMap(suit => ranks.map(rank => new Card(suit, rank)));
  }

  // Fisher-Yates Shuffle Algorithm
  shuffle() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [ this.deck[j], this.deck[i] ];
    }
  }

  /**
   * Draws the top card from the deck.
   *
   * Preconditions:
   * - Deck must contain at least one card.
   *
   * Postconditions:
   * - A Card object is returned.
   * - The deck size decreases by one.
   *
   * @returns {Card}
   * @throws {Error} If the deck is empty.
   */
  draw() {
    if (this.deck.length === 0) {
      throw new Error("Cannot draw from an empty deck.");
    }
    return this.deck.pop();
  }

  // Method to display all cards in the deck
  displayDeck() {
    return this.deck.map((card, index) => `${index + 1}: ${card.displayCard()}`)
        .join('\n');
  }
  getDeck() {
    return this.deck;
  } // Get the entire deck of cards, in array form.
}

module.exports = Deck;
