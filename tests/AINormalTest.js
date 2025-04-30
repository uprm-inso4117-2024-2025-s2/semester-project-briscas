const assert = require("assert");
const AINormal = require("../models/ai/AINormal");
const Card = require("../models/Card");

// Minimal FakeGameState mock
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

// Simple test runner
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

// --- Move Selection Logic ---
runTest("plays winning trump if opponent plays trump", () => {
  const trump = "Espadas";
  const gs = new FakeGameState(trump, "1", { 1: new Card(trump, "11") });
  const hand = [new Card(trump, "12"), new Card(trump, "1"), new Card("Copas", "7")];
  const ai = new AINormal(gs, hand);
  ai.isTurn = true;
  const selected = ai.selectCard();
  assert.strictEqual(selected.suit, trump);
  assert.strictEqual(selected.rank, "12");
});

runTest("plays trump if opponent plays non-trump", () => {
  const trump = "Oros";
  const gs = new FakeGameState(trump, "1", { 1: new Card("Copas", "10") });
  const hand = [new Card(trump, "7"), new Card("Copas", "3")];
  const ai = new AINormal(gs, hand);
  ai.isTurn = true;
  const selected = ai.selectCard();
  assert.strictEqual(selected.suit, trump);
  assert.strictEqual(selected.rank, "7");
});

runTest("throws error when hand is empty", () => {
  const gs = new FakeGameState("Bastos", "1", { 1: null });
  const ai = new AINormal(gs, []);
  ai.isTurn = true;
  assert.throws(() => ai.selectCard(), /No card selected in Normal mode/);
});

// --- handleTurn Method ---
runTest("handleTurn returns selected card after thinking", async () => {
  const trump = "Espadas";
  const gs = new FakeGameState(trump, "1", { 1: new Card(trump, "11") });
  const hand = [new Card(trump, "12"), new Card("Copas", "7")];
  const ai = new AINormal(gs, hand);
  ai.isTurn = true;
  ai.setThinkingTime(10);
  const selected = await ai.handleTurn();
  assert.strictEqual(selected.suit, trump);
  assert.strictEqual(selected.rank, "12");
});
