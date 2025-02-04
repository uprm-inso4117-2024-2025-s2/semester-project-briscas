const Deck = require('../models/Deck');

const deck = new Deck();

console.log("Checking deck size:")
console.log(deck.getDeckSize());

console.log("Displaying all cards in the deck:");
console.log(deck.displayDeck());

/* In order to run test, run the following command in your local terminal:

`node tests/DeckTest.js`    

Expected Test Output:

Checking deck size:
40
Displaying all cards in the deck:
1: Card: 1 of Oros (11 points)   
2: Card: 2 of Oros (0 points)    
3: Card: 3 of Oros (10 points)   
4: Card: 4 of Oros (0 points)    
5: Card: 5 of Oros (0 points)    
6: Card: 6 of Oros (0 points)    
7: Card: 7 of Oros (0 points)    
8: Card: 10 of Oros (2 points)   
9: Card: 11 of Oros (3 points)   
10: Card: 12 of Oros (4 points)  
11: Card: 1 of Copas (11 points) 
12: Card: 2 of Copas (0 points)
13: Card: 3 of Copas (10 points)
14: Card: 4 of Copas (0 points)
15: Card: 5 of Copas (0 points)
16: Card: 6 of Copas (0 points)
17: Card: 7 of Copas (0 points)
18: Card: 10 of Copas (2 points)
19: Card: 11 of Copas (3 points)
20: Card: 12 of Copas (4 points)
21: Card: 1 of Espadas (11 points)
22: Card: 2 of Espadas (0 points)
23: Card: 3 of Espadas (10 points)
24: Card: 4 of Espadas (0 points)
25: Card: 5 of Espadas (0 points)
26: Card: 6 of Espadas (0 points)
27: Card: 7 of Espadas (0 points)
28: Card: 10 of Espadas (2 points)
29: Card: 11 of Espadas (3 points)
30: Card: 12 of Espadas (4 points)
31: Card: 1 of Bastos (11 points)
32: Card: 2 of Bastos (0 points)
33: Card: 3 of Bastos (10 points)
34: Card: 4 of Bastos (0 points)
35: Card: 5 of Bastos (0 points)
36: Card: 6 of Bastos (0 points)
37: Card: 7 of Bastos (0 points)
38: Card: 10 of Bastos (2 points)
39: Card: 11 of Bastos (3 points)
40: Card: 12 of Bastos (4 points)
*/