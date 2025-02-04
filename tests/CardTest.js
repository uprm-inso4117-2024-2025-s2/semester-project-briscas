const Card = require("../models/Card");

const card1 = new Card("Copas", "3");  // Displays the card 3 of Copas.
console.log(card1.displayCard()); 

const card2 = new Card("Diamantes", "1");  // Displays a warning message since the rank is invalid.
console.log(card2.displayCard());

const card3 = new Card("Oros", "8");  // Displays a warning message since the rank is invalid.
console.log(card3.displayCard());

const card4 = new Card("Corazones", "9");  // Displays a warning message since the suit and rank are invalid.
console.log(card4.displayCard());