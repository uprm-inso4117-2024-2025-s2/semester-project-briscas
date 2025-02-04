const Deck = require('../models/Deck');

const deck = new Deck();

console.log("Checking deck size:")
console.log(deck.getDeckSize());

console.log("Displaying all cards in the deck:");
console.log(deck.displayDeck());

