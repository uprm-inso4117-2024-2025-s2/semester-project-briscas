/**
 * card_values.js
 *
 * Maintains a dictionary of Briscas card ranks to point values in JavaScript.
 */

// Briscas point values per rank
const CARD_POINTS = {
    1: 11,   // As (Ace)
    3: 10,   // 3
    12: 4,   // Rey (King)
    11: 3,   // Caballo
    10: 2    // Sota
  };
  
  /**
   * getCardPoints(rank)
   * Returns the point value of a given card rank in Briscas.
   * Any rank not in CARD_POINTS defaults to 0.
   */
  export function getCardPoints(rank) {
    return CARD_POINTS[rank] || 0;
  }
  