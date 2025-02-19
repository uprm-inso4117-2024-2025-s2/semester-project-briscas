const Player = require('../models/Player');
const Card = require("../models/Card");
const Deck = require('../models/Deck');

const card1 = new Card("Copas", "3")
const card2 = new Card("Oros", "1")
const deck = new Deck();

console.log('-----------------------')

console.log('A card is succesfully played from hand: ')
const player1 = new Player([card1,card2], 0, true);
player1.playCard(card1);

console.log("Is it player's turn, Expected false: ", player1.isTurn)


console.log('-----------------------')

console.log('A card is succesfully removed from hand: ')

const player2 = new Player([card1,card2], 0, true);

console.log("Before playCard(), Expected 2: ", player2.hand.length)
player2.playCard(card1);

console.log("After playCard(), Expected 1: ", player2.hand.length)

console.log('-----------------------')

console.log('A card is drawn succesfully: ')

const player3 = new Player([card1], 0, true);

console.log("Before draw(), Expected 1: ", player3.hand.length)

player3.draw(deck);

console.log("After draw(), Expected 2: ", player3.hand.length)

console.log('-----------------------')

console.log('A player cannot play when it is not their turn: ')
const player4 = new Player([card1,card2], 0, false);
try{
    player4.playCard(card1);
}
catch (error) {
    console.log("Expected error message received: \"It is not your turn to play a card.\", Result: ", error.message =="It is not your turn to play a card.");
}

console.log('-----------------------')

const player5 = new Player([card1], 0, false)
console.log('Player score before being updated, expected 0: ', player5.getScore())
player5.setScore(10);
console.log('Player score updated, expected value 10: ', player5.getScore())