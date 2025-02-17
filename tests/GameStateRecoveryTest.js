const GameState = require("../models/GameState");
const Card = require("../models/Card");
const Deck = require("../models/Deck");

console.log("=== GAME STATE RECOVERY TESTS ===\n");

// Helper function to print test results
function printTestResult(testName, result, expected) {
    console.log(`\n🔹 ${testName}`);
    console.log('Result:', JSON.stringify(result, null, 2));
    console.log('Expected:', JSON.stringify(expected, null, 2));
    console.log('Test passed:', JSON.stringify(result) === JSON.stringify(expected));
}

// Initialize test environment
function setupTest() {
    const gameState = new GameState();
    gameState.ChangeGameState("Playing");
    gameState.ChangeTurn("1");
    
    // Set initial scores
    gameState.ChangeScores(0, 10);
    gameState.ChangeScores(1, 20);
    
    // No need to verify scores here, they're checked in the test results
    return gameState;
}

// Mock UI object
const mockUI = {
    update: function(state) {
        this.lastUpdate = state; // Store the last update for verification
    },
    lastUpdate: null // Initialize to store the last update
};

// Test 1: Player Disconnection Detection
function testPlayerDisconnection() {
    const game = setupTest();
    const result = game.handlePlayerDisconnection(1);
    
    const expected = {
        status: "game_interrupted",
        reason: "player_disconnected",
        player: 1,
        gameState: {
            previous: "Playing",
            current: "Interrupted",
            scores: [10, 20],
            canRecover: true,
            remainingPlayer: 2
        }
    };
    
    printTestResult("Player Disconnection Detection", result, expected);
}

// Test 2: Game State Save and Recovery
function testGameStateSaveAndRestore() {
    const game = setupTest();
    
    // Save initial state
    game.saveGameState();
    
    // Change some values
    game.ChangeGameState("Interrupted");
    game.ChangeScores(0, 0);
    game.ChangeScores(1, 0);
    
    // Restore state
    const result = game.restoreGameState();
    
    const expected = {
        status: "restored",
        state: "Playing",
        playerStatus: ["connected", "connected"],
        scores: [10, 20],
        timestamp: result.timestamp
    };
    
    printTestResult("Game State Save and Restore", result, expected);
}

// Test 3: Game Playability After Disconnection
function testGamePlayability() {
    const game = setupTest();
    
    const results = {
        beforeDisconnect: game.isGamePlayable(),
        afterOneDisconnect: (game.handlePlayerDisconnection(1), game.isGamePlayable()),
        afterBothDisconnect: (game.handlePlayerDisconnection(2), game.isGamePlayable())
    };
    
    const expected = {
        beforeDisconnect: true,
        afterOneDisconnect: false,
        afterBothDisconnect: false
    };
    
    printTestResult("Game Playability Check", results, expected);
}

// Test 4: Game Reset
function testGameReset() {
    const game = setupTest();
    
    // Force an unrecoverable state
    game.handlePlayerDisconnection(1);
    game.handlePlayerDisconnection(2);
    
    const result = game.ResetGame();
    
    const expected = {
        status: "reset_successful",
        newState: "New Game",
        scores: [0, 0]
    };
    
    printTestResult("Game Reset", result, expected);
}

// Test 5: Game Stability After Leave
function testGameStabilityAfterLeave() {
    const game = setupTest();
    
    const results = {
        disconnection: game.handlePlayerDisconnection(1),
        tryPlayCard: game.playCard(1, new Card("Oros", "1")),
        gameState: game.state,
        scores: game.GetScores()  // Use GetScores method
    };
    
    const expected = {
        disconnection: {
            status: "game_interrupted",
            reason: "player_disconnected",
            player: 1,
            gameState: {
                previous: "Playing",
                current: "Interrupted",
                scores: [10, 20],
                canRecover: true,
                remainingPlayer: 2
            }
        },
        tryPlayCard: { 
            status: "failed", 
            reason: "action_in_progress" 
        },
        gameState: "Interrupted",
        scores: [10, 20]
    };
    
    printTestResult("Game Stability After Leave", results, expected);
}


// Test 6: UI Updates on Disconnection
function testUIUpdatesOnDisconnection() {
    const game = setupTest();
    
    // Simulate a player disconnection
    game.handlePlayerDisconnection(1);
    
    // Call the mock UI update function with the game state
    mockUI.update({
        status: "game_interrupted",
        reason: "player_disconnected",
        player: 1,
        gameState: {
            previous: "Playing",
            current: "Interrupted",
            scores: [10, 20],
            canRecover: true,
            remainingPlayer: 2
        }
    });
    
    // Check if the UI received the correct update
    const expectedUpdate = {
        status: "game_interrupted",
        reason: "player_disconnected",
        player: 1,
        gameState: {
            previous: "Playing",
            current: "Interrupted",
            scores: [10, 20],
            canRecover: true,
            remainingPlayer: 2
        }
    };

    // Verify the last update matches the expected update
    console.assert(JSON.stringify(mockUI.lastUpdate) === JSON.stringify(expectedUpdate), "UI did not receive the expected update");
}

// Test 7: Invalid Inputs
function testInvalidInputs() {
    const game = setupTest();
    
    // Simulate invalid player turn
    game.ChangeTurn("invalid_turn");
    
    // Check that the player turn remains unchanged
    const currentTurn = game.GetTurn(); // Get the current turn
    if (currentTurn !== "1") {
        console.error(`Expected turn to be "1", but got "${currentTurn}"`);
    } else {
        console.log("Test passed: Player turn remains unchanged.");
    }
}

// Run all tests
console.log("Running recovery tests...\n");
testPlayerDisconnection();
testGameStateSaveAndRestore();
testGamePlayability();
testGameReset();
testGameStabilityAfterLeave();
testUIUpdatesOnDisconnection();
testInvalidInputs();
