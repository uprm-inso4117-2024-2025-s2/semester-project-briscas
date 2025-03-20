// Para correr este test:
// -Tienen que tener instalado mocha chai
// -Se corre con "npx mocha AIHard.js"

const {expect} = require('chai');
const AIHard = require('../models/ai/AIHard');
const Card = require('../models/Card');

// FakeGameState simulates the minimal interface needed by AIHard.
class FakeGameState {
  /**
   * @param {string} trumpSuit - The trump suit for the round.
   * @param {string} turn - A string representing the active turn ("1" or "2").
   * @param {Object} playedCards - Object with keys 0 and 1 representing played
   *     cards.
   */
  constructor(trumpSuit, turn, playedCards) {
    this.trumpSuit = trumpSuit;
    this.turn = turn;
    this.playedCards = playedCards; // e.g., { 0: card, 1: card }
  }
  GetTrumpSuit() { return this.trumpSuit; }
  GetTurn() { return this.turn; }
  GetPlayedCards(index) { return this.playedCards[index]; }
}

describe('AIHard Class', function() {
  describe('Move Optimization Logic', function() {
    it('should select a winning trump card when opponent played trump and a winning trump exists',
       function() {
         // Scenario: trump suit "Espadas"; opponent played Espadas "11" (3
         // points).
         const trumpSuit = 'Espadas';
         // AI is player index 0 when game state's turn is "1"
         const fakeGameState =
             new FakeGameState(trumpSuit, "1", {1 : new Card(trumpSuit, "11")});
         // AI hand includes two trump cards that beat opponent's card.
         const hand = [
           new Card(trumpSuit, "12"), // 4 points
           new Card(trumpSuit, "1"),  // 11 points
           new Card("Copas", "7"),    // non-trump card
           new Card("Bastos", "3")    // non-trump card
         ];
         const ai = new AIHard(fakeGameState, hand);
         ai.isTurn = true; // Ensure it's AI's turn
         const selected = ai.selectCard();
         // Expect the AI to choose the winning trump card with the lowest
         // points (Espadas "12")
         expect(selected.suit).to.equal(trumpSuit);
         expect(selected.rank).to.equal("12");
       });

    it('should sacrifice the lowest non-trump card when opponent played trump and no winning trump exists',
       function() {
         // Scenario: trump suit "Copas"; opponent played Copas "1" (11 points)
         const trumpSuit = 'Copas';
         const fakeGameState =
             new FakeGameState(trumpSuit, "1", {1 : new Card(trumpSuit, "1")});
         // AI hand: trump card cannot beat opponent's card and at least one
         // non-trump exists.
         const hand = [
           new Card(trumpSuit, "12"), // trump (4 points) cannot beat 11
           new Card("Espadas",
                    "2"), // non-trump, assumed lowest points (0 points)
           new Card("Bastos", "3") // non-trump (10 points)
         ];
         const ai = new AIHard(fakeGameState, hand);
         ai.isTurn = true;
         const selected = ai.selectCard();
         expect(selected.suit).to.equal("Espadas");
         expect(selected.rank).to.equal("2");
       });

    it('should play the lowest trump card when opponent played non-trump and AI has trump cards',
       function() {
         // Scenario: trump suit "Bastos"; opponent played non-trump card.
         const trumpSuit = 'Bastos';
         const fakeGameState =
             new FakeGameState(trumpSuit, "1", {1 : new Card("Copas", "1")});
         // AI hand: contains trump cards and a non-trump.
         const hand = [
           new Card(trumpSuit, "10"), // trump (2 points)
           new Card(trumpSuit, "11"), // trump (3 points)
           new Card("Copas", "3")     // non-trump (10 points)
         ];
         const ai = new AIHard(fakeGameState, hand);
         ai.isTurn = true;
         const selected = ai.selectCard();
         // Expected: choose the lowest trump card, Bastos "10"
         expect(selected.suit).to.equal(trumpSuit);
         expect(selected.rank).to.equal("10");
       });

    it('should select a winning non-trump card when opponent played non-trump and such a card exists',
       function() {
         // Scenario: trump suit "Oros"; opponent played a non-trump card.
         // Opponent: Copas "10" (2 points)
         const trumpSuit = 'Oros';
         const opponentCard = new Card("Copas", "10"); // 2 points
         const fakeGameState =
             new FakeGameState(trumpSuit, "1", {1 : opponentCard});
         // AI hand: contains non-trump cards that can beat the opponent.
         const hand = [
           new Card("Bastos",
                    "11"), // 3 points (winning option, lowest winning)
           new Card("Espadas", "3"), // 10 points (winning but higher)
           new Card("Copas", "7")    // 0 points (losing)
         ];
         const ai = new AIHard(fakeGameState, hand);
         ai.isTurn = true;
         const selected = ai.selectCard();
         expect(selected.suit).to.equal("Bastos");
         expect(selected.rank).to.equal("11");
       });

    it('should play the lowest card overall when opponent played non-trump and no winning move exists',
       function() {
         // Scenario: trump suit "Oros"; opponent played a strong non-trump
         // card. Opponent: Copas "1" (11 points)
         const trumpSuit = 'Oros';
         const opponentCard = new Card("Copas", "1");
         const fakeGameState =
             new FakeGameState(trumpSuit, "1", {1 : opponentCard});
         // AI hand: no card beats 11 points.
         const hand = [
           new Card("Bastos", "12"), // 4 points
           new Card("Espadas", "10") // 2 points (lowest)
         ];
         const ai = new AIHard(fakeGameState, hand);
         ai.isTurn = true;
         const selected = ai.selectCard();
         expect(selected.suit).to.equal("Espadas");
         expect(selected.rank).to.equal("10");
       });
  });

  describe('Leading Scenario (No Opponent Card)', function() {
    it('should play the highest non-trump card when leading and non-trump cards are available',
       function() {
         // Scenario: trump suit "Bastos"; no opponent card (leading turn).
         const trumpSuit = 'Bastos';
         const fakeGameState = new FakeGameState(trumpSuit, "1", {1 : null});
         // AI hand: mix of trump and non-trump cards.
         const hand = [
           new Card("Copas", "1"), // non-trump, 11 points (highest non-trump)
           new Card("Espadas", "12"), // non-trump, 4 points
           new Card(trumpSuit, "2")   // trump (0 points)
         ];
         const ai = new AIHard(fakeGameState, hand);
         ai.isTurn = true;
         const selected = ai.selectCard();
         expect(selected.suit).to.equal("Copas");
         expect(selected.rank).to.equal("1");
       });

    it('should play the lowest trump card when leading and only trump cards exist',
       function() {
         // Scenario: trump suit "Bastos"; leading with hand containing only
         // trump cards.
         const trumpSuit = 'Bastos';
         const fakeGameState = new FakeGameState(trumpSuit, "1", {1 : null});
         const hand = [
           new Card(trumpSuit, "1"),  // 11 points
           new Card(trumpSuit, "12"), // 4 points
           new Card(trumpSuit, "10")  // 2 points (lowest)
         ];
         const ai = new AIHard(fakeGameState, hand);
         ai.isTurn = true;
         const selected = ai.selectCard();
         expect(selected.suit).to.equal(trumpSuit);
         expect(selected.rank).to.equal("10");
       });
  });

  describe('Error Handling', function() {
    it('should throw an error if no card is selected (empty hand)', function() {
      const trumpSuit = 'Copas';
      const fakeGameState = new FakeGameState(trumpSuit, "1", {1 : null});
      const hand = [];
      const ai = new AIHard(fakeGameState, hand);
      ai.isTurn = true;
      expect(() => ai.selectCard()).to.throw("No card selected in Hard mode");
    });
  });

  describe('handleTurn Method', function() {
    it('should eventually return the selected card after simulated thinking time',
       async function() {
         const trumpSuit = 'Espadas';
         const fakeGameState =
             new FakeGameState(trumpSuit, "1", {1 : new Card(trumpSuit, "11")});
         const hand = [
           new Card(trumpSuit, "12"), // winning trump card
           new Card("Copas", "7")
         ];
         const ai = new AIHard(fakeGameState, hand);
         ai.isTurn = true;
         // Set a short thinking time for faster test execution.
         ai.setThinkingTime(10);
         const selected = await ai.handleTurn();
         expect(selected.suit).to.equal(trumpSuit);
         expect(selected.rank).to.equal("12");
       });

    it('should reject if it is not the AI\'s turn', async function() {
      const trumpSuit = 'Bastos';
      const fakeGameState =
          new FakeGameState(trumpSuit, "1", {1 : new Card("Copas", "1")});
      const hand = [ new Card(trumpSuit, "10") ];
      const ai = new AIHard(fakeGameState, hand);
      // Simulate not being AI's turn.
      ai.isTurn = false;
      try {
        await ai.handleTurn();
        throw new Error(
            "handleTurn should have rejected when it is not the AI's turn");
      } catch (err) {
        expect(err.message).to.equal("Not AI's turn");
      }
    });
  });
});
