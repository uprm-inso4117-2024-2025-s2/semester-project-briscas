class Card {
    constructor(suit, rank, id = `${suit}-${rank}-${Math.random().toString(36).substr(2, 9)}`) {
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
        this.id = id; // Small tweak in case the Card definition in the front end clashes with the card definition in the back end.
    }

    // Returns a card with its rank, suit, and points. 
    displayCard() {
        let current_card = `Card: ${this.rank} of ${this.suit} (${this.points} points)`;

        return current_card; 
    }

    beats(otherCard, trumpSuit) {
        // If this card is trump and other isn't, this card wins
        if (this.suit === trumpSuit && otherCard.suit !== trumpSuit) {
            return true;
        }
        
        // If other card is trump and this isn't, other card wins
        if (otherCard.suit === trumpSuit && this.suit !== trumpSuit) {
            return false;
        }
        
        // If both cards are the same suit, compare their ranks
        if (this.suit === otherCard.suit) {
            return this.ranks[this.rank] > this.ranks[otherCard.rank];
        }
        
        // If different suits (and neither is trump), first card wins
        return true;
    }
}

// Make sure to export the entire class, not just an instance
module.exports = Card;