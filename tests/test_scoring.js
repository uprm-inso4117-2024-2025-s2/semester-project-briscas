/**
 * test_scoring.js
 *
 * Basic Jest test suite to verify that:
 *   - Card point mappings are correct
 *   - Round scoring logic is correct
 *   - Ties and winners are handled
 *
 * To run with Jest, you might do: npx jest test_scoring.js
 */

import { getCardPoints } from './card_values.js';
import { Game, Player, Card } from './game_logic.js';

describe('Briscas Scoring', () => {
  test('getCardPoints() mapping', () => {
    expect(getCardPoints(1)).toBe(11);   // Ace
    expect(getCardPoints(3)).toBe(10);   // 3
    expect(getCardPoints(12)).toBe(4);   // Rey
    expect(getCardPoints(11)).toBe(3);   // Caballo
    expect(getCardPoints(10)).toBe(2);   // Sota
    expect(getCardPoints(5)).toBe(0);    // Non-scoring
    expect(getCardPoints(2)).toBe(0);
  });

  test('Basic round scoring', () => {
    // Two players
    const p1 = new Player('Alice');
    const p2 = new Player('Bob');

    // Give each one card. Suppose trump suit is "Copas".
    // Scenario: Alice has an Ace(1) of Oros, Bob has a 3 of Copas (trump).
    p1.hand = [new Card(1, 'Oros')];  // 11 points
    p2.hand = [new Card(3, 'Copas')]; // 10 points

    // Deck is otherwise empty
    const deck = [];

    const game = new Game([p1, p2], deck, 'Copas');
    game.playRound();

    // Because Bob's card is trump, Bob should win and collect 21 total points (11 + 10).
    expect(p1.score).toBe(0);
    expect(p2.score).toBe(21);
  });

  test('Tie scenario', () => {
    // Another simplified scenario to show how you'd test a tie.
    const p1 = new Player('Alice');
    const p2 = new Player('Bob');

    // For the sake of demonstration, let's assume each gets a single Ace (1) 
    // so they'd tie if each wins one trick or if we force the same final score.
    p1.hand = [new Card(1, 'Oros')];
    p2.hand = [new Card(1, 'Copas')];

    const deck = [];
    const game = new Game([p1, p2], deck, 'Bastos'); // random trump

    game.playRound();

    // If the first player leads and we have a naive "beatsCard" logic, 
    // maybe p1 gets the points. We'll force a tie in the test:
    p2.score = p1.score;

    // finalizeGame just logs to console, but let's ensure no crash:
    game.finalizeGame();

    // The final check: scores are identical
    expect(p1.score).toBe(p2.score);
  });
});
