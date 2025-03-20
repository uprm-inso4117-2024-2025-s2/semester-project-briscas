const GameManager = require('../models/GameManager');

console.log('=== COMPREHENSIVE AI TURN TEST ===');

// Test 1: Single AI player vs human player
async function testSingleAIvsHuman() {
    console.log('\n----- Test 1: Single AI vs Human -----');
    const gameManager = new GameManager(['AI', 'Human'], "1", "Oros");
    gameManager.dealInitialHands();

    // Log initial state
    console.log('Initial game state:');
    console.log('Current turn index:', gameManager.currentTurnIndex);
    console.log('AI (Player 1) hand size:', gameManager.players[0].hand.length);
    console.log('Human (Player 2) hand size:', gameManager.players[1].hand.length);
    
    // Ensure the first player is an AI player
    console.log('First player is AI:', gameManager.players[0].isAI ? 'Yes' : 'No');
    
    // Simulate first round - AI plays first
    console.log('\nSimulating first round - AI plays first');
    await simulateRound(gameManager, 1); // Only simulate one player's turn
    
    // Simulate second round - Human plays
    console.log('\nSimulating second round - Human plays');
    await simulateRound(gameManager, 1); // Only simulate one player's turn
}

// Test 2: Multiple AI players
async function testMultipleAI() {
    console.log('\n----- Test 2: Multiple AI Players -----');
    
    // Create a game with one AI player to see how it's properly initialized
    const referenceGame = new GameManager(['AI', null]);
    const referenceAI = referenceGame.players[0];
    
    // Now create our test game
    const gameManager = new GameManager(['AI-1', 'AI-2', 'AI-3']);
    
    // Check if any player is not a proper AI and replace it with a proper one
    const AIPlayerModel = require("../models/ai/AIPlayerModel");//    const AIPlayer = require('../models/AIPlayer'); renamed
    for (let i = 0; i < gameManager.players.length; i++) {
        if (!gameManager.players[i].handleTurn) {
            console.log(`Replacing player ${i+1} with proper AIPlayer instance`);
            // Create a new AIPlayer with the same hand and score
            const hand = gameManager.players[i].hand;
            const score = gameManager.players[i].score;
            const isTurn = gameManager.players[i].isTurn;
            gameManager.players[i] = new AIPlayerModel(gameManager.gameState, hand, score, isTurn);
            gameManager.players[i].thinkingTime = 500; // Shorter thinking time for tests
        }
    }
    
    gameManager.dealInitialHands();

    // Log initial state
    console.log('Initial game state:');
    console.log('Current turn index:', gameManager.currentTurnIndex);
    
    for (let i = 0; i < gameManager.players.length; i++) {
        console.log(`Player ${i+1} hand size:`, gameManager.players[i].hand.length);
        console.log(`Player ${i+1} is AI:`, gameManager.players[i].isAI ? 'Yes' : 'No');
        console.log(`Player ${i+1} has handleTurn:`, !!gameManager.players[i].handleTurn);
    }
    
    // Simulate one complete round (3 players)
    console.log('\nSimulating one turn for each player');
    
    // Instead of trying to track the current turn index (which changes during the loop),
    // we'll make a separate attempt for each expected player
    let currentIndex = gameManager.currentTurnIndex;
    console.log(`Initial current turn index: ${currentIndex}`);
    
    for (let i = 0; i < gameManager.players.length; i++) {
        // Get the current player who should play
        const playerIndex = gameManager.currentTurnIndex;
        const player = gameManager.getCurrentPlayer();
        
        console.log(`\nTurn ${i+1}: Player ${playerIndex + 1} (AI) to play`);
        console.log(`Is player ${playerIndex + 1} an AI? ${player.isAI ? 'Yes' : 'No'}`);
        console.log(`Is it player ${playerIndex + 1}'s turn? ${player.isTurn ? 'Yes' : 'No'}`);
        
        // Trigger this player's turn
        gameManager.playCard(playerIndex);
        
        // Wait for AI turn to complete
        const waitTime = player.thinkingTime + 1000;
        console.log(`Waiting ${waitTime}ms for player ${playerIndex + 1}'s turn to complete...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        // Check if turn index changed
        console.log(`After waiting, current turn is now: ${gameManager.currentTurnIndex + 1}`);
    }
    
    // Log end of round state
    console.log('\nEnd of round stats:');
    for (let i = 0; i < gameManager.players.length; i++) {
        console.log(`Player ${i+1} hand size:`, gameManager.players[i].hand.length);
    }
    console.log('Current turn index:', gameManager.currentTurnIndex);
}

// Test 3: AI Recovery from Error
async function testAIErrorRecovery() {
    console.log('\n----- Test 3: AI Error Recovery -----');
    const gameManager = new GameManager(['AI', 'Human']);
    gameManager.dealInitialHands();
    
    // Log the current state before forcing empty hand
    console.log('Initial AI cards:');
    console.log(gameManager.players[0].hand.map(card => `${card.rank}${card.suit}`));
    
    // Force AI to have no cards to trigger error handling
    console.log('Forcing AI to have empty hand to test error recovery');
    gameManager.players[0].hand = [];
    
    // Verify the hand is empty
    console.log('AI hand is now empty:', gameManager.players[0].hand.length === 0 ? 'Yes' : 'No');
    
    // Save current turn before attempting AI play
    const initialTurn = gameManager.currentTurnIndex;
    console.log('Current turn before AI error:', initialTurn);
    
    // Try to make AI play
    console.log('Attempting to make AI play with no cards:');
    try {
        gameManager.playCard(0);
        
        // Wait long enough for both the normal thinking and the error timeout
        const waitTime = gameManager.players[0].thinkingTime * 2;
        console.log(`Waiting ${waitTime}ms for error handling to complete...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        // Check if turn switched after error recovery
        const newTurn = gameManager.currentTurnIndex;
        console.log('Current turn after error handling:', newTurn);
        console.log('Turn switched after error:', newTurn !== initialTurn ? 'Yes' : 'No');
    } catch (error) {
        console.log('Expected error caught at test level:', error.message);
    }
    
    // Additional wait to ensure all async operations complete
    await new Promise(resolve => setTimeout(resolve, 1000));
}

// Helper function to simulate a round with specified number of turns
async function simulateRound(gameManager, turnsToSimulate) {
    const playerCount = turnsToSimulate || gameManager.players.length;
    
    // Play cards for specified number of players
    for (let i = 0; i < playerCount; i++) {
        await simulatePlayerTurn(gameManager);
    }
    
    // Log end of round state
    console.log('End of round stats:');
    for (let i = 0; i < gameManager.players.length; i++) {
        console.log(`Player ${i+1} hand size:`, gameManager.players[i].hand.length);
    }
    console.log('Current turn index:', gameManager.currentTurnIndex);
}

// Helper function to simulate a single player's turn
async function simulatePlayerTurn(gameManager) {
    const currentPlayer = gameManager.getCurrentPlayer();
    const isAI = currentPlayer.isAI;
    const playerIndex = gameManager.currentTurnIndex;
    
    console.log(`Player ${playerIndex + 1} (${isAI ? 'AI' : 'Human'}) to play`);
    
    if (isAI) {
        console.log(`AI player ${playerIndex + 1} taking turn`);
        gameManager.playCard(playerIndex);
    } else {
        // For human players in this test, just play their first card
        if (currentPlayer.hand.length > 0) {
            const card = currentPlayer.hand[0];
            console.log(`Simulating human playing: ${card.rank}${card.suit}`);
            gameManager.playCard(playerIndex, card);
        } else {
            console.log('Human has no cards to play');
        }
    }
    
    // Wait for async operations to complete
    await new Promise(resolve => setTimeout(resolve, 1500));
}

// Run all tests in sequence with proper error handling
async function runAllTests() {
    try {
        await testSingleAIvsHuman();
        await testMultipleAI();
        await testAIErrorRecovery();
        
        // Final wait to ensure all async operations complete
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('\n=== ALL TESTS COMPLETED ===');
    } catch (error) {
        console.error('Test suite error:', error);
    }
}

// Execute tests
runAllTests().catch(error => {
    console.error('Unhandled error in test suite:', error);
}); 