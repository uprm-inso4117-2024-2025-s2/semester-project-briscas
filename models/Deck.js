const Card = require('./Card');

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
        );
    }

    // Fisher-Yates Shuffle Algorithm
    shuffle() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    // Draws the top card from the deck
    draw() {
        if (this.deck.length === 0) {
            throw new Error ("Cannot draw from an empty deck.");
        }
        return this.deck.pop();
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
