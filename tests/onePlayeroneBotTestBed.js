import { createRequire } from "module";
const require = createRequire(import.meta.url);
var GameManager = require("../models/GameManager");
const Fuzzer = require("../models/Fuzzer")


const sleep = t => new Promise(r => setTimeout(r, t))
await sleep(1)
console.log("\n\n\n")

var suits = ["Oros", "Copas", "Espadas", "Bastos"];
var trumpSuit = Math.floor(Math.random() * suits.length)
var game = new GameManager(["Human", "AI"], "1", trumpSuit);
console.log(GameManager);
console.log(game.trumpCard)
console.log(game.getPlayers())// Testbed to handle 1 player game, used in tandum with index.js, is not run in the code per se.
console.log("player 1 plays their hand")
game.playCard(0, game.getCurrentPlayer().giveHand()[0])
console.log("player 2 plays their hand")
game.playCard(1)
await sleep(5000)
console.log(game.getPlayers(), "\n\n")

console.log("Fuzzing Implementation Initialization\n") // Various variations of the Testbed used to test what would happen if input was fuzzed.

try{
    console.log("Fuzzing 1: Trumpsuit")
    trumpSuit = Fuzzer.charFuzz(624, true, 0, 255)
    console.log("trumpSuit Fuzzed")
    game = new GameManager(["Human", "AI"], "1", trumpSuit);
    console.log(game.trumpCard, "\n")
    console.log("player 1 plays their hand")
    game.playCard(0 ,game.getCurrentPlayer().giveHand()[0])
    console.log("player 2 plays their hand")
    game.playCard(1)
    await sleep(5000)
    console.log(game.getPlayers(), "\n\n")
} catch(error){ console.log(error)}

try{
    console.log(console.log("Fuzzing 2: player name"))
    const trumpSuit = Math.floor(Math.random() * suits.length)
    game = new GameManager(["Human", Fuzzer.charFuzz(624, true, 0, 255)], "1", trumpSuit);
    console.log("player Fuzzed")
    console.log(game.trumpCard, "\n")
    console.log(game.getPlayers())
    console.log("player 1 plays their hand")
    game.playCard(0 ,game.getCurrentPlayer().giveHand()[0])
    console.log("player 2 plays their hand")
    game.playCard(1)
    await sleep(5000)
    console.log(game.getPlayers(), "\n\n")
} catch(error){ console.log(error)}

try{
    console.log(console.log("Fuzzing 3: card played"))
    suits = ["Oros", "Copas", "Espadas", "Bastos"];
    trumpSuit = Math.floor(Math.random() * suits.length)
    var game = new GameManager(["Human", "AI"], "1", trumpSuit);
    console.log("player 1 plays their hand")
    game.playCard(0 ,Fuzzer.charFuzz(624, true, 0, 255))
    console.log("player card Fuzzed")
    console.log("player 2 plays their hand")
    game.playCard(1)
    await sleep(5000)
    console.log(game.getPlayers(), "\n\n")
} catch(error){ console.log(error)}