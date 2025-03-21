// test.js

// Sample cards and game board rendering simulation
const suits = ['oros', 'copas', 'espadas', 'bastos']; // Card suits
const ranks = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12]; // Card ranks

// Mock function to generate image path based on suit and rank
function getCardImagePath(suit, rank) {
  if (!suits.includes(suit) || !ranks.includes(rank)) {
    return '';
  }
  return `/assets/cards/${suit}_${rank}.png`;
}

// Function to simulate rendering cards in hand
function renderCardsInHand(hand) {
    if (hand.length === 0) {
      console.log('No cards to render.');
      return;  // Early return if the hand is empty
    }
    
    hand.forEach(card => {
      const { suit, rank } = card;
      const imagePath = getCardImagePath(suit, rank);
      console.log(`Rendering card: ${suit} ${rank} -> Image Path: ${imagePath}`);
    });
  }
  

// Simple assert function to check if the value matches expectations
function assert(actual, expected, testName) {
  if (actual === expected) {
    console.log(`✔ Test passed: ${testName}`);
  } else {
    console.log(`✘ Test failed: ${testName}. Expected ${expected} but got ${actual}`);
  }
}

// Test: Check if cards are rendered properly
function testRenderCards() {
  // Mock player hand
  const playerHand = [
    { suit: 'bastos', rank: 1 },
    { suit: 'copas', rank: 12 },
    { suit: 'bastos', rank: 7 },
  ];

  console.log('Running test: Render cards with valid hand');
  renderCardsInHand(playerHand);

  // Assertions
  assert(getCardImagePath('oros', 1), '/assets/cards/oros_1.png', 'Card "oros 1" image path');
  assert(getCardImagePath('copas', 12), '/assets/cards/copas_12.png', 'Card "copas 12" image path');
  assert(getCardImagePath('espadas', 7), '/assets/cards/espadas_7.png', 'Card "espadas 7" image path');
}

// Test: Check if empty hand renders no cards
function testEmptyHand() {
  console.log('Running test: Empty hand');
  renderCardsInHand([]); // No cards to render

  // Assertions: Expect no cards rendered, thus no image paths
  assert(getCardImagePath('', ''), '', 'Empty hand should not render anything');
}

// Test: Check if card data is incorrect
function testIncorrectCardData() {
  console.log('Running test: Incorrect card data');
  const incorrectHand = [
    { suit: 'bastos', rank: 1 },
    { suit: 'copas', rank: 100 },  // Invalid rank
    { suit: 'xyz', rank: 5 },      // Invalid suit
  ];
  renderCardsInHand(incorrectHand);

  // Assertions: Expect empty paths for invalid cards
  assert(getCardImagePath('copas', 100), '', 'Card with invalid rank should return empty path');
  assert(getCardImagePath('xyz', 5), '', 'Card with invalid suit should return empty path');
}

// Run all tests
function runTests() {
  testRenderCards();
  testEmptyHand();
  testIncorrectCardData();
}

runTests();
