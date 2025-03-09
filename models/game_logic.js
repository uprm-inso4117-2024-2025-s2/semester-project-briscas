/**
 * game_logic.js
 *
 * Implements core Briscas flow:
 *   - Round-based scoring
 *   - Determining who wins each round
 *   - Calculating final winner or tie
 *   - Displaying score updates
 */

import { getCardPoints } from './card_values.js';

/**
 * Example "Player" class placeholder.
 * Adapt this or remove if you have your own Player logic.
 */
export class Player {
  constructor(name) {
    this.name = name;
    this.score = 0;
    this.hand = []; // array of Card objects
  }

  playCard() {
    // Example: pop the "first" card in hand
    if (this.hand.length > 0) {
      return this.hand.shift();
    }
    return null;
  }
}

/**
 * Example "Card" class placeholder.
 * Use your own if you already have a Card structure.
 */
export class Card {
  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
  }

  toString() {
    return `Card(rank=${this.rank}, suit=${this.suit})`;
  }
}

/**
 * Briscas rank "power" mapping for comparing two cards of the same suit.
 * Typically in Briscas:
 *    As (1) is highest
 *    3
 *    Rey (12)
 *    Caballo (11)
 *    Sota (10)
 *    9, 8, 7, 6, 5, 4, 2 (lowest)
 */
function briscasRankValue(rank) {
  const rankOrder = {
    1: 14,  // As
    3: 13,
    12: 12, // Rey
    11: 11, // Caballo
    10: 10, // Sota
    9: 9,
    8: 8,
    7: 7,
    6: 6,
    5: 5,
    4: 4,
    2: 2
  };
  // Default to whatever the card rank is if not found
  return rankOrder[rank] || rank;
}

/**
 * Class "Game" representing the Briscas match.
 */
export class Game {
  /**
   * @param {Player[]} players - array of player objects
   * @param {Card[]} deck      - array of card objects
   * @param {string} trumpSuit - the suit designated as trump
   */
  constructor(players, deck, trumpSuit) {
    this.players = players;
    this.deck = deck;
    this.trumpSuit = trumpSuit;
    this.currentRound = 1;
  }

  /**
   * Returns true if there's at least one player with cards
   * or if your rules say the deck is still relevant.
   */
  canPlayRound() {
    return this.players.some(player => player.hand.length > 0);
  }

  /**
   * The game is over if the deck is empty AND
   * no players have any cards left (or your custom condition).
   */
  isGameOver() {
    const deckEmpty = (this.deck.length === 0);
    const handsEmpty = this.players.every(player => player.hand.length === 0);
    return deckEmpty && handsEmpty;
  }

  /**
   * Compare two cards to see if 'challengingCard' beats 'currentWinningCard'.
   * Simplified placeholder; adapt for your official Briscas rules.
   */
  beatsCard(challengingCard, currentWinningCard) {
    // 1) If same suit, compare briscas rank
    if (challengingCard.suit === currentWinningCard.suit) {
      return briscasRankValue(challengingCard.rank) >
             briscasRankValue(currentWinningCard.rank);
    }

    // 2) If challenging is trump and current is not, challenging wins
    if (challengingCard.suit === this.trumpSuit &&
        currentWinningCard.suit !== this.trumpSuit) {
      return true;
    }

    // 3) If current is trump and challenging is not, current remains the winner
    if (currentWinningCard.suit === this.trumpSuit &&
        challengingCard.suit !== this.trumpSuit) {
      return false;
    }

    // 4) Different non-trump suits: leading card remains the winner
    return false;
  }

  /**
   * Conduct a single round of Briscas:
   *   - Each player attempts to play 1 card
   *   - Determine which card wins
   *   - Sum the card points and add to winner's score
   */
  playRound() {
    if (!this.canPlayRound()) {
      return; // No valid plays left
    }

    // Each player plays one card
    const plays = this.players.map(player => {
      const card = player.playCard();
      return { player, card };
    });

    // Filter out any null (no card played)
    const validPlays = plays.filter(item => item.card !== null);
    if (validPlays.length === 0) {
      return; // No one could play
    }

    // Assume the first valid card is the "leading" card
    let winner = validPlays[0];

    // Compare each subsequent play to find the winning card
    for (let i = 1; i < validPlays.length; i++) {
      const challenger = validPlays[i];
      if (this.beatsCard(challenger.card, winner.card)) {
        winner = challenger;
      }
    }

    // Calculate total points from these played cards
    let totalPoints = 0;
    for (const vp of validPlays) {
      totalPoints += getCardPoints(vp.card.rank);
    }

    // Add the total points to the winner's score
    winner.player.score += totalPoints;

    // Display or log the round results
    this.displayRoundResults(winner.player, validPlays, totalPoints);

    this.currentRound += 1;
  }

  /**
   * Provide in-game feedback/logging. Adjust or replace with your UI updates.
   */
  displayRoundResults(roundWinner, validPlays, points) {
    console.log(`\n=== Round ${this.currentRound} Results ===`);
    console.log("Cards played:");
    validPlays.forEach(({ player, card }) => {
      console.log(`  ${player.name} played ${card.toString()}`);
    });
    console.log(`Round winner: ${roundWinner.name} (+${points} points)`);
    console.log("Current Scores:");
    this.players.forEach(p => {
      console.log(`  ${p.name}: ${p.score}`);
    });
    console.log("=========================================\n");
  }

  /**
   * Once the game is done, finalize scores and announce a winner or tie.
   */
  finalizeGame() {
    // Sort players by highest score first
    const sorted = [...this.players].sort((a, b) => b.score - a.score);
    const topScore = sorted[0].score;

    // Find all players who share the top score
    const winners = sorted.filter(p => p.score === topScore);
    if (winners.length > 1) {
      // Tie
      const names = winners.map(w => w.name).join(', ');
      console.log(`It's a tie! Players (${names}) all have ${topScore} points.`);
    } else {
      // Single winner
      console.log(`Winner: ${winners[0].name} with ${winners[0].score} points!`);
    }

    // Optional: show final scoreboard
    console.log("=== Final Scores ===");
    sorted.forEach(player => {
      console.log(`${player.name} -> ${player.score}`);
    });
    console.log("====================\n");
  }
}
