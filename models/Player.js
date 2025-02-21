const Card = require('./Card');

class Player{
    constructor(hand = [], score = 0, isTurn = false, cardMax = 10) {
        this.hand = hand;
        //defined as an array with given maximum number of cards
        this.score = score;
        //defined as a int
        this.isTurn = isTurn;
        //defined as a boolean
        this.canDraw = true;
        //defined as a boolean
        this.cardMax = cardMax;

    }
    temporaryHand = null;
    giveHand(){
        return this.hand;
        //Return the given hand of the player.
    }
    setScore(newScore){
        this.score = newScore;
        //Set the score of player to the given ammount.
    }
    addScore(newScore){
        this.score += newScore;
        //Alternative to .setScore(), Adds the given ammount to the score of the player.
    }
    getScore(){
        return this.score;
    }
    draw(Deck) {
        
        if(!Deck || typeof Deck.draw !== 'function') {
            throw new Error("Invalid deck provided.");
        }
        if (!this.isTurn) {
            //checks if it's not the player's turn
            throw new Error("It is not your turn to draw.");
        }
        if (!this.canDraw) {
            //checks if they have drawn already
            throw new Error("Drawing is not allowed at this time.");
        }
        const drawnCard = Deck.draw()
        // Checks if the drawn card is valid
        if (!drawnCard) {
            throw new Error("The deck is empty.");
        }
        //add the card to the hand
        this.hand.push(drawnCard);
        // Reset the draw permission after drawing
        this.canDraw = false;
    }
    playCard(card) {
        // Checks if the input card is a valid card
        if (!card || !(card instanceof Card)) {
            throw new Error("Invalid card played.");
        }
        if (!this.hand.includes(card)){
            throw new Error("Card is not in player's hand.")
        }
        //Checks if it is the player's turn
        if (!this.isTurn) {
            throw new Error("It is not your turn to play a card.")
        }

        // Add the card to the temporary hand
        this.temporaryHand = card;

        // Remove the card from the player's hand
        this.hand = this.hand.filter(c => c !== card);

        // End the player's turn
        this.isTurn = false;

        // Allow the player to draw a card
        this.canDraw = true; // Allow the player to draw a card
        return card; // reutrn played card
    }
    turnToggle(){
        this.isTurn = !this.isTurn;
        if(this.isTurn) {
            this.canDraw = true;
        }
    }

}

module.exports = Player; // Export the Player class
