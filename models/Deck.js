const Card = require('./Card'); // Import the Card class

class Deck {
    constructor() {
        this.deck = []; // Stores the 40 unique cards
        this.initializeDeck(); // Generate the deck
    }

    // Initialize the deck by creating 40 unique cards
    initializeDeck() {
        const suits = ["Oros", "Copas", "Espadas", "Bastos"];
        const ranks = ["1", "2", "3", "4", "5", "6", "7", "10", "11", "12"];

        this.deck = suits.flatMap(suit =>
            ranks.map(rank => new Card(suit, rank))
        ).filter(card => card.suit && card.rank); // Remove invalid cards
    }

    // Check deck size
    getDeckSize() {
        return this.deck.length;
    }

    // Method to display all cards in the deck
    displayDeck() {
        return this.deck.map((card, index) => `${index + 1}: ${card.displayCard()}`).join('\n');
    }
}

module.exports = Deck;
