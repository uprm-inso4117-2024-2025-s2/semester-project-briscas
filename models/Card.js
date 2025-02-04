class Card {
    constructor(suit, rank) {
        this.suits = ["Oros", "Copas", "Espadas", "Bastos"];
        this.ranks = {"1": 11, "2": 0, "3": 10, "4": 0, "5": 0, "6": 0, "7": 0, "10": 2, "11": 3, "12": 4};  // Card ranks along with their corresponding points.
        
        // If either the suit or the rank of the card are invalid, this shows a warning message indicating that the values are invalid and sets them to null.
        if (!this.suits.includes(suit) || !(rank in this.ranks)) {
            console.warn(`Invalid input: ${rank} of ${suit}`);
            suit = null;
            rank = null;
        }
        
        this.suit = suit;
        this.rank = rank;
        this.points = this.ranks[rank];
    }

    // Returns a card with its rank, suit, and points. 
    displayCard() {
        let current_card = `Card: ${this.rank} of ${this.suit} (${this.points} points)`;

        return current_card; 
    }
}

module.exports = Card;