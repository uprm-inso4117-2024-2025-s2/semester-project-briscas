const {expect} = require('chai');
const AIEasy = require('../models/ai/AIEasy');
const Card = require('../models/Card');

// Minimal FakeGameState: Even though AIEasy ignores game state details,
// we supply a simple object so that any global reference to gameState is
// defined.
class FakeGameState {
  constructor(opponentPlayedCard = null) {
    this.opponentPlayedCard = opponentPlayedCard;
  }
}

// Set a global gameState so that if AIPlayerModel references it, it is defined.
global.gameState = new FakeGameState();

describe('AIEasy Class', function() {
  describe('Lowest Card Selection', function() {
    it('should always select the lowest-value card from its hand', function() {
      // In our Card implementation, assume "2" has 0 points, which is the
      // lowest.
      const hand = [
        new Card("Copas", "1"),   // e.g., 11 points
        new Card("Espadas", "2"), // e.g., 0 points -> expected lowest
        new Card("Oros", "3")     // e.g., 10 points
      ];
      const fakeState = new FakeGameState();
      const ai = new AIEasy(fakeState, hand);
      const selected = ai.selectCard();
      expect(selected.suit).to.equal("Espadas");
      expect(selected.rank).to.equal("2");
    });

    it('should throw an error when hand is empty', function() {
      const fakeState = new FakeGameState();
      const ai = new AIEasy(fakeState, []);
      expect(() => ai.selectCard()).to.throw("No cards in hand");
    });

    it('should ignore opponent actions and select based solely on its hand',
       function() {
         // Create two game states: one with an opponent card and one without.
         const stateWithOpponent = new FakeGameState(new Card("Bastos", "1"));
         const stateWithoutOpponent = new FakeGameState(null);

         const hand = [
           new Card("Oros", "11"),   // e.g., 3 points
           new Card("Copas", "2"),   // e.g., 0 points -> expected lowest
           new Card("Espadas", "12") // e.g., 4 points
         ];

         const aiWithOpponent = new AIEasy(stateWithOpponent, hand.slice());
         const aiWithoutOpponent =
             new AIEasy(stateWithoutOpponent, hand.slice());

         const selectedWithOpponent = aiWithOpponent.selectCard();
         const selectedWithoutOpponent = aiWithoutOpponent.selectCard();

         // Both should return the same lowest card.
         expect(selectedWithOpponent.suit).to.equal("Copas");
         expect(selectedWithOpponent.rank).to.equal("2");
         expect(selectedWithoutOpponent.suit).to.equal("Copas");
         expect(selectedWithoutOpponent.rank).to.equal("2");
       });
  });

  describe('Stateless Decision Making', function() {
    it('should not track previously played cards; repeated calls return the same card if hand is unchanged',
       function() {
         const hand = [
           new Card("Bastos", "11"), // e.g., 3 points
           new Card("Espadas", "3"), // e.g., 10 points
           new Card("Oros", "2")     // e.g., 0 points -> expected lowest
         ];
         const fakeState = new FakeGameState();
         const ai = new AIEasy(fakeState, hand.slice());

         const firstSelection = ai.selectCard();
         const secondSelection = ai.selectCard();

         // Repeated calls without modifying the hand should return the same
         // card.
         expect(firstSelection.suit).to.equal(secondSelection.suit);
         expect(firstSelection.rank).to.equal(secondSelection.rank);
       });

    it('should extend rounds by playing the lowest card instead of winning aggressively',
       function() {
         // Even if a higher card might win the round, the AI should pick the
         // lowest.
         const hand = [
           new Card("Copas", "1"), // e.g., 11 points (high, winning potential)
           new Card("Espadas", "2"), // e.g., 0 points (lowest)
           new Card("Bastos", "3")   // e.g., 10 points
         ];
         const fakeState = new FakeGameState();
         const ai = new AIEasy(fakeState, hand);
         const selected = ai.selectCard();
         // The AI should choose the card with the lowest value: "Espadas" "2"
         expect(selected.suit).to.equal("Espadas");
         expect(selected.rank).to.equal("2");
       });
  });

  describe('Valid Move Selection', function() {
    it('should always select a card that exists in its hand', function() {
      const hand = [
        new Card("Oros", "3"),   // e.g., 10 points
        new Card("Copas", "10"), // e.g., 2 points
        new Card("Bastos", "12") // e.g., 4 points
      ];
      const fakeState = new FakeGameState();
      const ai = new AIEasy(fakeState, hand);
      const selected = ai.selectCard();

      // Ensure the selected card is one of the cards in the hand.
      const handIdentifiers = hand.map(card => `${card.suit}-${card.rank}`);
      const selectedIdentifier = `${selected.suit}-${selected.rank}`;
      expect(handIdentifiers).to.include(selectedIdentifier);
    });
  });
});
