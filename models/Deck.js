const Card = require('./Card'); // Import the Card class

class Deck {
    constructor() {
        this.deck = []; // Stores the 40 unique cards
        this.trumpSuit = null; //Stores Trump suit
        this.trumpCard = null; //Stores Trump card
        this.initializeDeck(); // Generate the deck
    }
    //Getters and Setters
    // Get the trump suit
    getTrumpSuit() {
        return this.trumpSuit;
    }

    // Get the trump card
    getTrumpCard() {
        return this.trumpCard;
    }

    // Check deck size
    getDeckSize() {
        return this.deck.length;
    }

    //Draws a card 
    getCard() {
        return this.deck.pop();
    }

    //Set up the trump suit
    setupTrumpSuit() {
        if (!this.trumpCard) {
            this.trumpCard = this.getCard();
            this.trumpSuit = this.trumpCard.suit;
        }
        return this.trumpCard;
    }
    
    //Functions
    
    // Initialize the deck by creating 40 unique cards
    initializeDeck() {
        const suits = ["Oros", "Copas", "Espadas", "Bastos"];
        const ranks = ["1", "2", "3", "4", "5", "6", "7", "10", "11", "12"];

        this.deck = suits.flatMap(suit =>
            ranks.map(rank => new Card(suit, rank))
        ).filter(card => card.suit && card.rank); // Remove invalid cards
    }

    // Method to display all cards in the deck
    displayDeck() {
        return this.deck.map((card, index) => `${index + 1}: ${card.displayCard()}`).join('\n');
    }
}

module.exports = Deck;
