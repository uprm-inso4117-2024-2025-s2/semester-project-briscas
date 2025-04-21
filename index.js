const GameManager = require("./models/GameManager");
const Card = require("./models/Card.js");
const http = require('node:http');
const initializeSocketServer = require('./src/network/socketServer');
const express = require("express");
const app = express();
app.use(express.json())
const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:5173"],
}
app.use(cors(corsOptions)); // Initialize connection with the front end.
var player1Hand;
var player2Hand;
var drawCard;
var data = {
  "data" : [null, null, null]
}
var gameMode = {
  "gameMode" : null
}
var player1Hand = data.data[0];
var player2Hand= data.data[1];
var drawCard= data.data[2]; // Variable initialization to store for game processing.
app.get("/data", (req, res)=> {
  res.json(data); // Returns game Data
  
})
app.get("/gameMode", (req, res)=> {
  res.json(gameMode); // Returns currently stored gamemode.
})
app.post("/data", function(req, res) {
  data = req.body;
  res.json(data); // Stores game Data as JSON filled with array, mostly placeholder at the moment, is likely to be further refined into specific instructions via alternate URLs
                  // So that player input can be processed. An alternative approach would be to have a dedicated section in the array used to define what the POST call changed, say "playCard" or "takeCard"
});
app.post("/gameMode", function(req, res) { // Store's gamemode from the front end to initialize the initial gamestate.
  gameMode = req.body;
  res.json(req.body);
  console.log(gameMode.gameMode)
  if (gameMode.gameMode === "1p"){ // Initialize 1 player with bot, their cards, trump card, and deck order.
    suits = ["Oros", "Copas", "Espadas", "Bastos"];
    i = Math.floor(Math.random() * suits.length);
    trumpSuit = suits[i];
    var game = new GameManager(["Player", "AI"], "1", trumpSuit);
    console.log(GameManager);
    data = {
      "data" : [game.getPlayers()[0].giveHand(), game.getPlayers()[1].giveHand(), game.getDeck().getDeck(), game.getDeck().getTrumpCard()]
    }
  }
});


app.listen(3000, () => {
  console.log("Server started on port 3000");
});

//const hostname = '127.0.0.1';
//const port = 3000;

//const server = http.createServer((req, res) => {
//  res.statusCode = 200;
//  res.setHeader('Content-Type', 'text/plain');
//  res.end('Briscas Multiplayer Server is running!\n');
//});
//
//// Initialize WebSocket server on top of the HTTP server
//initializeSocketServer(server);
//
//server.listen(port, hostname, () => {
//  console.log(`Server running at http://${hostname}:${port}/`);
//});