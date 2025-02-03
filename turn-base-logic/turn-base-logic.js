//Create sample player class to get started
//Later  we will use the oficial player class and import it to this file

class Player {
    constructor(id,name,hand=[]){
        this.id =id;
        this.name =name;
        this.hand = hand;
        this.score = 0;
    }

}

class TurnManager {
    // Initialize the turn manager
    constructor(player1,player2) {
        this.players = [player1,player2];
        this.player1 = player1;
        this.player2 = player2;
        this.currentTurnIndex = Math.floor(Math.random() * 2);
        this.currentRoundMoves = [];
    }

    // Get Player that is supposed to play a card
    getCurrentPlayer() {
        return this.players[this.currentTurnIndex];
    }

    // Check if it is a players turn
    isTurn(player) {
        return this.getCurrentPlayer().id == player.id
    }

    // Process a move (for example, playing a card).
    playMove(player, move) {
        if (!this.isPlayersTurn(player)) {
            throw new Error(`Invalid move: It's not ${player.name}'s turn!`);
        }

        // Record the move.
        this.currentRoundMoves.push({ player, move });
        console.log(`${player.name} played ${move.name || move}.`);

        // After processing the move, switch turns.
        this.switchTurn();
    }

    // Switch turn to the next player.
    switchTurn() {
        this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length;
        console.log(`Turn switched. It is now ${this.getCurrentPlayer().name}'s turn.`);
    }

    // Utility to check if the round is complete (i.e., all players have made a move).
    isRoundComplete() {
        return this.currentRoundMoves.length === this.players.length;
    }

    // Reset moves for a new round.
    resetRound() {
        this.currentRoundMoves = [];
        console.log('Round reset.');
  }

}