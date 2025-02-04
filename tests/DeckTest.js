const Deck = require('../models/Deck');

const deck = new Deck();

console.log("Before shuffling:");
console.log(deck.displayDeck());

deck.shuffle();
console.log("\nAfter shuffling:");
console.log(deck.displayDeck());

// Test drawing 3 cards
console.log("\nDrawing 3 cards:")
for (let i = 0; i < 3; i++) {
    console.log(deck.draw().displayCard());
}

console.log(`\nDeck size after drawing 3 cards: ${deck.getDeckSize()}`);

console.log("After drawing 3 cards:");
console.log(deck.displayDeck());

// Test empty deck behavior
console.log("\nTesting empty deck behavior:");
while (deck.getDeckSize() > 0) {
    deck.draw();
}

try {
    deck.draw();
} catch (error) {
    console.log(`Error caught: ${error.message}`);
}

// console.log("Checking deck size:")
// console.log(deck.getDeckSize());



/* In order to run test, run the following command in your local terminal:

`node tests/DeckTest.js`    

*/