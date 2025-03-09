const Card = require("../models/Card");
const RoundManager = require("../models/Winner");
const GameState = require("../models/GameState");
const Deck = require("../models/Deck");

console.log("=== GAME STATE TESTS ===\n");

// Setup game state

game_state = new GameState;
const game_default = new GameState;
const round_manager = new RoundManager(game_state.GetTrumpSuit());
const d = new Deck;
const card = new Card("Oros", "1");

// Helper function to print round results
function printchange(testName) {
    console.log(`\n🔹 ${testName}`);
    console.log('\n game state:', game_state.GetGameState());
    console.log('\n turn:', game_state.GetTurn());
    console.log('\n deck:', game_state.GetDeck());
    console.log('\n trump suit:', game_state.GetTrumpSuit());
    console.log('\n played card 1:', game_state.GetPlayedCards(0));
    console.log('\n played card 2:', game_state.GetPlayedCards(1));
    console.log('\n score 1:', game_state.GetScores(0));
    console.log('\n score 2:', game_state.GetScores(1));
    console.log('\n player hand 1:', game_state.GetPlayerHand(0));
    console.log('\n player hand 2: ', game_state.GetPlayerHand(0));  
    game_state.game_states = ["New game", "Round start", "Playing", "Round end", "Game end"];
    game_state.state = "New game";
    game_state.turn = ["1","2"];
    game_state.player_turn = null;
    game_state.deck = null;
    game_state.trump_suit = null;
    game_state.played_cards = [null,null];
    game_state.scores = [null,null];
    game_state.player_hands = [null, null];
        
}

printchange("Default");
// Test change game state
game_state.ChangeGameState("Round end");
printchange("Test 1: change game state");

// Test  change turn
game_state.ChangeTurn("1");
printchange("Test 2: change turn");

// Test  change deck
game_state.ChangeDeck(d);
printchange("Test 3: change deck");

// Test change trump suit
game_state.ChangeTrumpSuit("Oros");
printchange("Test 4: trump suit");

// Test change played card
game_state.ChangePlayedCards(card, card);
printchange("Test 5: change deck");

// Test change scores 
game_state.ChangeScores(0, 120);
printchange("Test 6: change scores");

// Test reset game
game_state.ChangeGameState("Round end");
game_state.ChangeTurn("1");
game_state.ChangeDeck(d);
game_state.ChangeTrumpSuit("Oros");
game_state.ChangePlayedCards(card, card);
game_state.ChangeScores(0, 120);
game_state.ResetGame();
printchange("Test 7: reset game");


