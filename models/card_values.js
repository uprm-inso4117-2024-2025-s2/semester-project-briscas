/**
 * card_values.js
 *
 * Maintains a dictionary of Briscas card ranks to point values in JavaScript.
 */

// Briscas point values per rank
const CARD_POINTS = {
  1 : 11, // As (Ace)
  3 : 10, // 3
  12 : 4, // Rey (King)
  11 : 3, // Caballo
  10 : 2  // Sota
};

/**
 * Returns the Briscas point value for a given card rank.
 *
 * Preconditions:
 * - The rank must be a number (1–12).
 *
 * Postconditions:
 * - Returns the correct point value, or 0 for non-scoring cards.
 *
 * @param {number} rank - The rank of the card.
 * @returns {number} The point value (0 if not a scoring rank).
 */
export function getCardPoints(rank) { return CARD_POINTS[rank] || 0; }
