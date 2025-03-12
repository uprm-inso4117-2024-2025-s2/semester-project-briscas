class VisualElements {
    constructor(gameContainer) {
        this.gameContainer = gameContainer;
        this.scoreBoard = null;
        this.turnIndicator = null;
        this.cardContainer = null;

        this.initializeUI();
    }

    initializeUI() {
        // Create UI elements dynamically
        this.scoreBoard = this.createElement('div', 'score-board');
        this.turnIndicator = this.createElement('div', 'turn-indicator');
        this.cardContainer = this.createElement('div', 'card-container');

        // Append elements to the game container
        this.gameContainer.appendChild(this.scoreBoard);
        this.gameContainer.appendChild(this.turnIndicator);
        this.gameContainer.appendChild(this.cardContainer);
    }

    createElement(tag, className, textContent = '') {
        const element = document.createElement(tag);
        element.className = className;
        element.textContent = textContent;
        return element;
    }

    /**
     * @param {Object} card - The card object (must have `suit` and `rank` properties).
     */
    renderCard(card) {
        if (!card || !card.suit || !card.rank) return;

        const cardElement = this.createElement('div', 'card');

        // Create image element for the card
        const cardImg = document.createElement('img');
        cardImg.src = `/visual_elements/images/cards/${card.suit.toLowerCase()}_${card.rank}.png`;
        cardImg.alt = `${card.rank} of ${card.suit}`;
        cardImg.className = 'card-image';

        // Append the image to the card container
        cardElement.appendChild(cardImg);
        this.cardContainer.appendChild(cardElement);
    }

    // updateScore(player1Score, player2Score) {
    //     this.scoreBoard.textContent = `Score: ${player1Score} - ${player2Score}`;
    // }

    // updateTurnIndicator(playerName) {
    //     this.turnIndicator.textContent = `${playerName}'s turn`;
    // }

    clearCards() {
        this.cardContainer.innerHTML = '';
    }
}

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

export default Card;

// module.exports = VisualElements;