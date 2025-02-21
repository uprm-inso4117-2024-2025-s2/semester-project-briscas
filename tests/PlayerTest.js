const Player = require('../models/Player');
const Card = require("../models/Card");
const Deck = require('../models/Deck');

const card1 = new Card("Copas", "3")
const card2 = new Card("Oros", "1")
const card3 = new Card("Bastos", "7")
const card4 = new Card("Espadas", "2")
const deck = new Deck();

console.log('-----------------------')

console.log('A card is successfully played from hand: ')
const player1 = new Player([card1,card2], 0, true);
player1.playCard(card1);

console.log("Is it player's turn, Expected false: ", player1.isTurn)


console.log('-----------------------')

console.log('A card is successfully removed from hand: ')

const player2 = new Player([card1,card2], 0, true);

console.log("Before playCard(), Expected 2: ", player2.hand.length)
player2.playCard(card1);

console.log("After playCard(), Expected 1: ", player2.hand.length)

console.log('-----------------------')

console.log('A card is drawn successfully: ')

const player3 = new Player([card1], 0, true);

console.log("Before draw(), Expected 1: ", player3.hand.length)

player3.draw(deck.draw());

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

console.log('Player tries to draw card but fails:')
const player5 = new Player([card3], 0, true);
player5.canDraw = false;
try{
    player5.draw(card3);
}
catch (error) {
    console.log("Expected error message received: \"Drawing is not allowed at this time.\", Result: ", error.message == "Drawing is not allowed at this time.");
}

console.log('-----------------------')

console.log('A card cannot be played because the player doesnt own it:')
const player6 = new Player([card1,card3], 0, true);
try{
    player6.playCard(card2);
}
catch (error) {
    console.log("Expected error message received: \"Card is not in players hand.\", Result: ", error.message == "Card is not in players hand.");
}

console.log('-----------------------')

console.log('Player cant draw anymore cards:')
const player7 = new Player([card1,card2,card3], 0, true);
try{
    player7.draw(card4);
}
catch (error) {
    console.log("Expected error message received: \"You can't draw any more cards.\", Result: ", error.message == "You can't draw any more cards.");
}

console.log('-----------------------')

console.log('Player cant play more than one card at a time:')
const player8 = new Player([card1,card2,card3], 0, true);
try{
    player8.playCard(card1, card2);
}
catch (error) {
    console.log("Expected error message received: \"You cant play more than one card at a time.\", Result: ", error.message == "You cant play more than one card at a time.");
}

console.log('-----------------------')

console.log('Player tries to draw more than one card at a time:')
const player9 = new Player([card3], 0, true);
try{
    player9.draw(card1, card2);
}
catch (error) {
    console.log("Expected error message received: \"You cant draw more than one card at a time.\", Result: ", error.message == "You cant draw more than one card at a time.");
}

console.log('-----------------------')

const player10 = new Player([card1], 0, false)
console.log('Player score before being updated, expected 0: ', player10.getScore())
player10.setScore(10);
console.log('Player score updated, expected value 10: ', player10.getScore())

console.log('-----------------------')