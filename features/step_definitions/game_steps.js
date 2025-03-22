const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

// Import your game logic modules
const Card = require('../../models/Card');
const GameState = require('../../models/GameState');
const RoundManager = require('../../models/Winner'); // RoundManager is exported from Winner.js
const Deck = require('../../models/Deck');
const Player = require('../../models/Player');

/**
 * --- Game State Scenarios ---
 */

// Scenario: Initialize a new game and verify game state and deck
Given('a new game is started', function () {
  // Create and reset the game state
  this.gameState = new GameState();
  this.gameState.ResetGame();
});

When('the game is initialized', function () {
  // In this example, ResetGame() performs the initialization.
  // No additional action is required.
});

Then('the game state should be {string}', function (expectedState) {
  assert.strictEqual(this.gameState.GetGameState(), expectedState);
});

Then('the deck should contain {int} cards', function (expectedCount) {
  // When the trump card is drawn during ResetGame(), one card is removed.
  const deck = this.gameState.GetDeck();
  assert.strictEqual(deck.getDeckSize(), expectedCount);
});

Then('a trump card should be set', function () {
  const trump = this.gameState.GetTrumpSuit();
  assert.ok(trump, 'Expected a trump card to be set');
});


/**
 * --- Card Comparison Scenarios ---
 */

// Scenario: Compare two cards given a trump suit
Given('a card with rank {string} and suit {string} is created', function (rank, suit) {
  this.card1 = new Card(suit, rank);
});

Given('another card with rank {string} and suit {string} is created', function (rank, suit) {
  this.card2 = new Card(suit, rank);
});

Given('the trump suit is {string}', function (trumpSuit) {
  this.trumpSuit = trumpSuit;
});

When('we compare the first card against the second', function () {
  this.beatsResult = this.card1.beats(this.card2, this.trumpSuit);
});

Then('the first card should beat the second card', function () {
  assert.strictEqual(this.beatsResult, true);
});

Then('the first card should not beat the second card', function () {
  assert.strictEqual(this.beatsResult, false);
});


/**
 * --- Round Manager Scenarios ---
 */

// Scenario: Determine round winner and update scores
Given('a round manager with trump suit {string} is created', function (trumpSuit) {
  this.roundManager = new RoundManager(trumpSuit);
});

Given('player {string} plays a card with rank {string} and suit {string}', function (player, rank, suit) {
  const card = new Card(suit, rank);
  this.roundManager.playCard(player, card);
});

When('we determine the round winner', function () {
  // This will throw an error if both players have not played.
  this.winner = this.roundManager.determineWinner();
});

Then('the round winner should be {string}', function (expectedWinner) {
  assert.strictEqual(this.winner, expectedWinner);
});

Then('the scores should be updated with total round points {int}', function (totalPoints) {
  const scores = this.roundManager.scores;
  if (this.winner === 'player1') {
    assert.strictEqual(scores.player1, totalPoints);
  } else {
    assert.strictEqual(scores.player2, totalPoints);
  }
});


/**
 * --- Player Action Scenarios ---
 */

// Scenario: A player plays a valid card
Given('a player with a hand containing a card with rank {string} and suit {string}', function (rank, suit) {
  const card = new Card(suit, rank);
  // Create a player with a single card in hand and it's their turn.
  this.player = new Player([card], 0, true);
});

When('the player plays the card with rank {string} and suit {string}', function (rank, suit) {
  const cardToPlay = this.player.hand.find(c => c.rank === rank && c.suit === suit);
  // Catch any error thrown if the card is invalid or not in hand.
  try {
    this.player.playCard(cardToPlay);
    this.playError = null;
  } catch (err) {
    this.playError = err;
  }
});

Then('the player\'s hand should not contain a card with rank {string} and suit {string}', function (rank, suit) {
  const cardFound = this.player.hand.find(c => c.rank === rank && c.suit === suit);
  assert.strictEqual(cardFound, undefined);
});

Then('it should no longer be the player\'s turn', function () {
  assert.strictEqual(this.player.isTurn, false);
});


// Scenario: A player draws a card
Given('a player with an empty hand and it is their turn to draw', function () {
  // Create a player with an empty hand and set isTurn to true.
  this.player = new Player([], 0, true);
});

When('the player draws a card with rank {string} and suit {string}', function (rank, suit) {
  const drawnCard = new Card(suit, rank);
  try {
    this.player.draw(drawnCard);
    this.drawError = null;
  } catch (err) {
    this.drawError = err;
  }
});

Then('the player\'s hand should contain a card with rank {string} and suit {string}', function (rank, suit) {
  const cardFound = this.player.hand.find(c => c.rank === rank && c.suit === suit);
  assert.ok(cardFound, `Expected to find card ${rank} of ${suit} in hand.`);
});

Then('drawing should no longer be allowed', function () {
  assert.strictEqual(this.player.canDraw, false);
});


// Scenario: Attempting an invalid action results in an error
When('the player attempts to play a card with rank {string} and suit {string}', function (rank, suit) {
  try {
    // Create a card that is likely not in the player's hand.
    const card = new Card(suit, rank);
    this.player.playCard(card);
    this.actionError = null;
  } catch (err) {
    this.actionError = err;
  }
});

Then('an error with message {string} should be thrown', function (expectedMessage) {
  assert.ok(this.actionError, 'Expected an error but none was thrown.');
  assert.strictEqual(this.actionError.message, expectedMessage);
});

//Scenario: A trick is resolved based on the Brisca suit
Given('Player A plays a 5 of cups and Player B plays a 7 of swords', function () {
  this.player1 = new Player([new Card('cups', '5')], 0, true);
  this.player2 = new Player([new Card('swords', '7')], 0, false);
});

When('The trump suit is cups', function () {
  this.trumpSuit = 'cups';
});

Then('Player A should win the trick', function () {
  const roundManager = new RoundManager(this.trumpSuit);
  roundManager.playCard('player1', this.player1.hand[0]);
  roundManager.playCard('player2', this.player2.hand[0]);
  const winner = roundManager.determineWinner();
  assert.strictEqual(winner, 'player1');
});