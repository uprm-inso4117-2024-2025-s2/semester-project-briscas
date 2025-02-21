const Card = require("./Card");

class Player {
  constructor(hand, score, isTurn, cardMax) {
    this.hand = hand;
    //defined as an typedArray with given maximum number of cards
    this.score = score;
    //defined as a int
    this.isTurn = isTurn;
    //defined as a boolean
    this.canDraw = true;
    //defined as a boolean
  }
  temporaryHand = null;
  giveHand() {
    return hand;
    //Return the given hand of the player.
  }

  setScore(newScore) {
    this.score = newScore;
    //Set the score of player to the given amount.
  }

  addScore(newScore) {
    this.score = +newScore;
    //Alternative to .setScore(), Adds the given amount to the score of the player.
  }

  getScore() {
    return this.score;
  }

  draw(Deck) {
    const drawnCard = Deck.draw();
    if (!this.isTurn) {
      //checks if it's not the player's turn
      throw new Error("It is not your turn to draw.");
    }
    if (!this.canDraw) {
      //checks if they have drawn already
      throw new Error("Drawing is not allowed at this time.");
    }
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
    // Doesn't allow more than one card to be played
    if (arguments.length > 1) {
      throw new Error("You cant play more than one card at a time.");
    }
    // Checks if the input card is a valid card
    if (!card || !(card instanceof Card)) {
      throw new Error("Invalid card played.");
    }
    if (this.isTurn) {
      // Checks if the card is in the player's hand
      if (!this.hand.includes(card)) {
        throw new Error("Card is not in players hand.");
      }

      // Add the card to the temporary hand
      this.temporaryHand = card;

      // Remove the card from the player's hand
      this.hand = this.hand.filter(
        (c) => c.rank !== card.rank || c.suit !== card.suit
      );

      // End the player's turn
      this.isTurn = false;

      this.temporaryHand = null;

      // Allow the player to draw a card
      this.canDraw = true; // Allow the player to draw a card
      return card; // return played card
    } else {
      throw new Error("It is not your turn to play a card.");
    }
  }

  draw(drawnCard) {
    // Doesn't allow more than one card to be drawn
    if (arguments.length > 1) {
      throw new Error("You cant draw more than one card at a time.");
    }
    if (!this.isTurn) {
      throw new Error("It is not your turn to draw.");
    }
    if (!this.canDraw) {
      throw new Error("Drawing is not allowed at this time.");
    }
    // Checks if the drawn card is valid
    if (!drawnCard) {
      throw new Error("The deck is empty.");
    }
    // If the player already has 3 or more cards, the player can't draw any more cards
    if (this.hand.length >= 3) {
      throw new Error("You can't draw any more cards.");
    }
    this.hand.push(drawnCard);

    // Reset the draw permission after drawing
    this.canDraw = false;
  }

  turnToggle() {
    this.isturn = !this.isturn;
  }
}

module.exports = Player; // Export the Player class
