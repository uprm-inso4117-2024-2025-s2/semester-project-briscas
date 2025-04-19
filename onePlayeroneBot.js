var GameManager = require("./models/GameManager");

suits = ["Oros", "Copas", "Espadas", "Bastos"];
i = Math.floor(Math.random() * suits.length);
trumpSuit = suits[i];

suits = ["Oros", "Copas", "Espadas", "Bastos"];
var game = new GameManager(["Player", "AI"], "1", trumpSuit);
const a = game.getPlayers()[0]
console.log(GameManager); // Testbed to handle 1 player game, used in tandum with index.js, is not run in the code per se.