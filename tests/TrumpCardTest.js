const Card = require('../models/Card');

console.log("=== TRUMP CARD TESTS ===\n");

// Test 1: Low trump beats high non-trump
const trumpCard = new Card('Oros', '2');    // Low value trump
const highCard = new Card('Copas', '1');    // High value non-trump
console.log("Test 1: Low trump beats high non-trump");
console.log(`${trumpCard.displayCard()} vs ${highCard.displayCard()}`);
console.log(`Trump suit is Oros. Result: ${trumpCard.beats(highCard, 'Oros')}\n`);

// Test 2: Higher trump beats lower trump
const highTrump = new Card('Espadas', '1');
const lowTrump = new Card('Espadas', '2');
console.log("Test 2: Higher trump beats lower trump");
console.log(`${highTrump.displayCard()} vs ${lowTrump.displayCard()}`);
console.log(`Trump suit is Espadas. Result: ${highTrump.beats(lowTrump, 'Espadas')}\n`);

// Test 3: Non-trump vs trump
const nonTrump = new Card('Copas', '1');    // High value non-trump
const lowTrumpCard = new Card('Bastos', '2');    // Low value trump
console.log("Test 3: Non-trump vs trump");
console.log(`${nonTrump.displayCard()} vs ${lowTrumpCard.displayCard()}`);
console.log(`Trump suit is Bastos. Result: ${nonTrump.beats(lowTrumpCard, 'Bastos')}\n`);

