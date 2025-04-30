const assert = require("assert");
const AIHard = require("../models/ai/AIHard");
const Card = require("../models/Card");

// FakeGameState mock
class FakeGameState {
  constructor(trumpSuit, turn, playedCards) {
    this.trumpSuit = trumpSuit;
    this.turn = turn;
    this.playedCards = playedCards;
  }
  GetTrumpSuit() {
    return this.trumpSuit;
  }
  GetTurn() {
    return this.turn;
  }
  GetPlayedCards(index) {
    return this.playedCards[index];
  }
}

// Test runner
function runTest(name, fn) {
  Promise.resolve()
    .then(fn)
    .then(() => console.log(`✅ ${name}`))
    .catch((err) => {
      console.error(`❌ ${name}`);
      console.error(err);
      process.exitCode = 1;
    });
}

// --- Move Optimization Logic ---
runTest("selects lowest winning trump vs opponent's trump", () => {
  const trump = "Espadas";
  const gs = new FakeGameState(trump, "1", { 1: new Card(trump, "11") });
  const hand = [new Card(trump, "12"), new Card(trump, "1"), new Card("Copas", "7"), new Card("Bastos", "3")];
  const ai = new AIHard(gs, hand);
  ai.isTurn = true;
  const c = ai.selectCard();
  assert.strictEqual(c.suit, trump);
  assert.strictEqual(c.rank, "12");
});

runTest("sacrifices lowest non-trump if cannot win with trump", () => {
  const trump = "Copas";
  const gs = new FakeGameState(trump, "1", { 1: new Card(trump, "1") });
  const hand = [new Card(trump, "12"), new Card("Espadas", "2"), new Card("Bastos", "3")];
  const ai = new AIHard(gs, hand);
  ai.isTurn = true;
  const c = ai.selectCard();
  assert.strictEqual(c.suit, "Espadas");
  assert.strictEqual(c.rank, "2");
});

runTest("plays lowest trump vs non-trump", () => {
  const trump = "Bastos";
  const gs = new FakeGameState(trump, "1", { 1: new Card("Copas", "1") });
  const hand = [new Card(trump, "10"), new Card(trump, "11"), new Card("Copas", "3")];
  const ai = new AIHard(gs, hand);
  ai.isTurn = true;
  const c = ai.selectCard();
  assert.strictEqual(c.suit, trump);
  assert.strictEqual(c.rank, "10");
});

runTest("plays winning non-trump card if possible", () => {
  const trump = "Oros";
  const gs = new FakeGameState(trump, "1", { 1: new Card("Copas", "10") });
  const hand = [new Card("Bastos", "11"), new Card("Espadas", "3"), new Card("Copas", "7")];
  const ai = new AIHard(gs, hand);
  ai.isTurn = true;
  const c = ai.selectCard();
  assert.strictEqual(c.suit, "Bastos");
  assert.strictEqual(c.rank, "11");
});

runTest("plays lowest overall if no win exists", () => {
  const trump = "Oros";
  const gs = new FakeGameState(trump, "1", { 1: new Card("Copas", "1") });
  const hand = [new Card("Bastos", "12"), new Card("Espadas", "10")];
  const ai = new AIHard(gs, hand);
  ai.isTurn = true;
  const c = ai.selectCard();
  assert.strictEqual(c.suit, "Espadas");
  assert.strictEqual(c.rank, "10");
});

// --- Leading (no opponent card) ---
runTest("plays highest non-trump when leading", () => {
  const trump = "Bastos";
  const gs = new FakeGameState(trump, "1", { 1: null });
  const hand = [new Card("Copas", "1"), new Card("Espadas", "12"), new Card(trump, "2")];
  const ai = new AIHard(gs, hand);
  ai.isTurn = true;
  const c = ai.selectCard();
  assert.strictEqual(c.suit, "Copas");
  assert.strictEqual(c.rank, "1");
});

runTest("plays lowest trump when leading and only trump available", () => {
  const trump = "Bastos";
  const gs = new FakeGameState(trump, "1", { 1: null });
  const hand = [new Card(trump, "1"), new Card(trump, "12"), new Card(trump, "10")];
  const ai = new AIHard(gs, hand);
  ai.isTurn = true;
  const c = ai.selectCard();
  assert.strictEqual(c.suit, trump);
  assert.strictEqual(c.rank, "10");
});

// --- Error handling ---
runTest("throws error if hand is empty", () => {
  const trump = "Copas";
  const gs = new FakeGameState(trump, "1", { 1: null });
  const ai = new AIHard(gs, []);
  ai.isTurn = true;
  assert.throws(() => ai.selectCard(), /No card selected in Hard mode/);
});

// --- handleTurn ---
runTest("handleTurn returns selected card after thinking", async () => {
  const trump = "Espadas";
  const gs = new FakeGameState(trump, "1", { 1: new Card(trump, "11") });
  const hand = [new Card(trump, "12"), new Card("Copas", "7")];
  const ai = new AIHard(gs, hand);
  ai.isTurn = true;
  ai.setThinkingTime(10);
  const c = await ai.handleTurn();
  assert.strictEqual(c.suit, trump);
  assert.strictEqual(c.rank, "12");
});

runTest("handleTurn rejects if not AI's turn", async () => {
  const trump = "Bastos";
  const gs = new FakeGameState(trump, "1", { 1: new Card("Copas", "1") });
  const hand = [new Card(trump, "10")];
  const ai = new AIHard(gs, hand);
  ai.isTurn = false;
  try {
    await ai.handleTurn();
    throw new Error("Expected rejection for wrong turn");
  } catch (err) {
    assert.strictEqual(err.message, "Not AI's turn");
  }
});
