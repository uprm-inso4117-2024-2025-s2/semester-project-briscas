// tests/CoreUnitTests.js

const {expect} = require('chai');
const Deck = require('../models/Deck');
const GameManager = require('../models/GameManager');
const RoundManager = require('../models/Winner');
const AIPlayerModel = require('../models/ai/AIPlayerModel');
const GameState = require('../models/GameState');
const Card = require('../models/Card');
const {getCardPoints} = require('../models/card_values');

describe('Deck.draw()', () => {
  it('should return a Card and reduce deck size', () => {
    const deck = new Deck();
    const initialSize = deck.getDeckSize();
    const card = deck.draw();
    expect(card).to.have.property('suit');
    expect(deck.getDeckSize()).to.equal(initialSize - 1);
  });

  it('should throw when drawing from empty deck', () => {
    const deck = new Deck();
    while (deck.getDeckSize() > 0)
      deck.draw();
    expect(() => deck.draw()).to.throw("Cannot draw from an empty deck.");
  });
});

describe('GameManager.playCard()', () => {
  it('should throw error if player plays out of turn', () => {
    const gm = new GameManager([ "Player1", "Player2" ], [ 0, 1 ], "Oros");
    expect(() => gm.playCard(1, new Card("Oros", "1")))
        .to.throw("It's not your turn!");
  });

  it('should throw error if no card is provided for human', () => {
    const gm = new GameManager([ "Player1", "Player2" ], [ 0, 1 ], "Oros");
    expect(() => gm.playCard(0))
        .to.throw("Card must be provided for regular player");
  });

  it('should play a card and switch turn', () => {
    const gm = new GameManager([ "Player1", "Player2" ], [ 0, 1 ], "Oros");
    const initialTurn = gm.currentTurnIndex;
    const card = gm.getCurrentPlayer().hand[0];

    gm.playCard(initialTurn, card);

    expect(gm.currentTurnIndex).to.not.equal(initialTurn);
  });
});

describe('AIPlayerModel.handleTurn()', () => {
  it('should reject if not AI\'s turn', async () => {
    const gameState = new GameState();
    const ai =
        new AIPlayerModel(gameState, [ new Card("Oros", "1") ], 0, false);
    try {
      await ai.handleTurn();
    } catch (e) {
      expect(e.message).to.equal("Not AI's turn");
    }
  });

  it('should resolve with a card from hand if AI selects', async () => {
    const gameState = new GameState();
    gameState.ChangeTurn("1");
    gameState.ChangeTrumpSuit("Oros");

    const ai = new AIPlayerModel(gameState, [ new Card("Oros", "1") ], 0, true);
    ai.selectCard = () => ai.hand[0];

    const card = await ai.handleTurn();
    expect(card).to.have.property('suit');
  });
});

describe('RoundManager.determineWinner()', () => {
  it('should determine correct winner from two cards', () => {
    const rm = new RoundManager('Oros', 2);
    rm.playCard('player1', new Card('Oros', '1'));
    rm.playCard('player2', new Card('Copas', '3'));
    const winner = rm.determineWinner();
    expect(winner).to.equal('player1');
  });

  it('should throw error if not all players have played', () => {
    const rm = new RoundManager('Oros', 2);
    rm.playCard('player1', new Card('Oros', '1'));
    expect(() => rm.determineWinner()).to.throw();
  });
});

describe('getCardPoints()', () => {
  it('should return correct point values for scoring cards', () => {
    expect(getCardPoints(1)).to.equal(11);
    expect(getCardPoints(3)).to.equal(10);
    expect(getCardPoints(10)).to.equal(2);
  });

  it('should return 0 for non-scoring ranks', () => {
    expect(getCardPoints(5)).to.equal(0);
    expect(getCardPoints(8)).to.equal(0);
  });
});
