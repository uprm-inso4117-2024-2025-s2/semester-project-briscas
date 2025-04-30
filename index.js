const express = require("express");
const cors = require("cors");
const http = require('node:http');
const initializeSocketServer = require('./src/network/socketServer');
const GameManager = require("./models/GameManager");
const Card = require("./models/Card.js");

const app = express();
app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:5173"]
};
app.use(cors(corsOptions));

// Game data storage
let data = { data: [null, null, null] };
let gameMode = { gameMode: null };

app.get("/data", (req, res) => {
  res.json({
    data: data.data, // hands, deck, trump
    turn: data.turn || "Unknown" // default fallback
  });
});

app.get("/gameMode", (req, res) => res.json(gameMode));

app.post("/data", (req, res) => {
  data = req.body;
  res.json(data);
});

app.post("/gameMode", (req, res) => {
  gameMode = req.body;
  res.json(gameMode);
  console.log(`[MODE] Game mode set to: ${gameMode.gameMode}`);


  if (gameMode.gameMode === "1p") {
    const suits = ["Oros", "Copas", "Espadas", "Bastos"];
    const trumpSuit = suits[Math.floor(Math.random() * suits.length)];
    const game = new GameManager(["Player", "AI"], "1", trumpSuit);

    console.log("[GAME] 1P Game Initialized");

    data = {
      data: [
        game.getPlayers()[0].giveHand(),
        game.getPlayers()[1].giveHand(),
        game.getDeck().getDeck(),
        game.getDeck().getTrumpCard()
      ],
      turn: game.gameState.GetTurn()
    };
  }
});

// 👇 Create HTTP server and start Socket.IO
const httpServer = http.createServer(app);
initializeSocketServer(httpServer);

httpServer.listen(3000, () => {
  console.log("Server + Socket.IO listening on port 3000");
});
