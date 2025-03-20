//install
// npm install --save-dev mocha
//run with
// npm install --save-dev mocha

const assert = require("assert");
const AINormal = require("../models/ai/AINormal");
const Card = require("../models/Card");

// FakeGameState simulates the minimal interface needed by AINormal.
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

describe("AINormal Class", function () {
  describe("Move Selection Logic", function () {
    it("should play a winning trump card if the opponent plays a trump", function () {
      const trumpSuit = "Espadas";
      const fakeGameState = new FakeGameState(trumpSuit, "1", {
        1: new Card(trumpSuit, "11"),
      });
      const hand = [
        new Card(trumpSuit, "12"), // 4 points
        new Card(trumpSuit, "1"), // 11 points
        new Card("Copas", "7"), // Non-trump
      ];
      const ai = new AINormal(fakeGameState, hand);
      ai.isTurn = true;
      const selected = ai.selectCard();

      assert.strictEqual(selected.suit, trumpSuit);
      assert.strictEqual(selected.rank, "12");
    });

    it("should play a trump card if opponent played non-trump and AI has trump", function () {
      const trumpSuit = "Oros";
      const fakeGameState = new FakeGameState(trumpSuit, "1", {
        1: new Card("Copas", "10"),
      });
      const hand = [
        new Card(trumpSuit, "7"), // Lowest trump
        new Card("Copas", "3"), // Non-trump
      ];
      const ai = new AINormal(fakeGameState, hand);
      ai.isTurn = true;
      const selected = ai.selectCard();

      assert.strictEqual(selected.suit, trumpSuit);
      assert.strictEqual(selected.rank, "7"); // AI should play the trump card
    });

    it("should throw an error if no cards are available", function () {
      const trumpSuit = "Bastos";
      const fakeGameState = new FakeGameState(trumpSuit, "1", { 1: null });
      const hand = [];
      const ai = new AINormal(fakeGameState, hand);
      ai.isTurn = true;

      assert.throws(() => ai.selectCard(), /No card selected in Normal mode/);
    });
  });

  describe("handleTurn Method", function () {
    it("should return the selected card after thinking time", async function () {
      const trumpSuit = "Espadas";
      const fakeGameState = new FakeGameState(trumpSuit, "1", {
        1: new Card(trumpSuit, "11"),
      });
      const hand = [
        new Card(trumpSuit, "12"), // Winning trump card
        new Card("Copas", "7"),
      ];
      const ai = new AINormal(fakeGameState, hand);
      ai.isTurn = true;
      ai.setThinkingTime(10); // Short delay for testing
      const selected = await ai.handleTurn();

      assert.strictEqual(selected.suit, trumpSuit);
      assert.strictEqual(selected.rank, "12");
    });
  });
});
