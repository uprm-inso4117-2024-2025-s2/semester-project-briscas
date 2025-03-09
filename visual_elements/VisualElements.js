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

module.exports = VisualElements;