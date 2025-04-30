const assert = require('assert');
const AIEasy = require('../models/ai/AIEasy');
const Card = require('../models/Card');

// Minimal FakeGameState class
class FakeGameState {
  constructor(opponentPlayedCard = null) {
    this.opponentPlayedCard = opponentPlayedCard;
  }
}

// Helper function for running tests
function runTest(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
  } catch (err) {
    console.error(`❌ ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

// Test group: Lowest Card Selection
runTest('should select the lowest-value card from its hand', () => {
  const hand = [
    new Card("Copas", "1"),
    new Card("Espadas", "2"),
    new Card("Oros", "3")
  ];
  const ai = new AIEasy(new FakeGameState(), hand);
  const selected = ai.selectCard();
  assert.strictEqual(selected.suit, "Espadas");
  assert.strictEqual(selected.rank, "2");
});

runTest('should throw an error when hand is empty', () => {
  const ai = new AIEasy(new FakeGameState(), []);
  assert.throws(() => ai.selectCard(), /No cards in hand/);
});

runTest('should ignore opponent actions and select based solely on hand', () => {
  const hand = [
    new Card("Oros", "11"),
    new Card("Copas", "2"),
    new Card("Espadas", "12")
  ];
  const ai1 = new AIEasy(new FakeGameState(new Card("Bastos", "1")), hand.slice());
  const ai2 = new AIEasy(new FakeGameState(), hand.slice());

  const c1 = ai1.selectCard();
  const c2 = ai2.selectCard();

  assert.strictEqual(c1.suit, "Copas");
  assert.strictEqual(c1.rank, "2");
  assert.strictEqual(c2.suit, "Copas");
  assert.strictEqual(c2.rank, "2");
});

// Test group: Stateless Decision Making
runTest('should return same card on repeated calls if hand is unchanged', () => {
  const hand = [
    new Card("Bastos", "11"),
    new Card("Espadas", "3"),
    new Card("Oros", "2")
  ];
  const ai = new AIEasy(new FakeGameState(), hand.slice());
  const c1 = ai.selectCard();
  const c2 = ai.selectCard();

  assert.strictEqual(c1.suit, c2.suit);
  assert.strictEqual(c1.rank, c2.rank);
});

runTest('should extend rounds by playing the lowest-value card', () => {
  const hand = [
    new Card("Copas", "1"),
    new Card("Espadas", "2"),
    new Card("Bastos", "3")
  ];
  const ai = new AIEasy(new FakeGameState(), hand);
  const selected = ai.selectCard();

  assert.strictEqual(selected.suit, "Espadas");
  assert.strictEqual(selected.rank, "2");
});

// Test group: Valid Move Selection
runTest('should always select a card that exists in its hand', () => {
  const hand = [
    new Card("Oros", "3"),
    new Card("Copas", "10"),
    new Card("Bastos", "12")
  ];
  const ai = new AIEasy(new FakeGameState(), hand);
  const selected = ai.selectCard();

  const handIds = hand.map(c => `${c.suit}-${c.rank}`);
  const selectedId = `${selected.suit}-${selected.rank}`;
  assert.ok(handIds.includes(selectedId));
});
