class RoundManager {
    constructor(players) {
        this.turnManager = new TurnManager(players);
        this.roundMoves = [];
    }

    startRound() {
        this.roundMoves = [];
        console.log(`New round started. It is ${this.turnManager.getCurrentPlayer().name}'s turn.`);
    }

    // Process a move (for example, playing a card).
    playMove(player, move) {
        if (!this.turnManager.isTurn(player)) {
            throw new Error(`Invalid move: It's not ${player.name}'s turn!`);
        }

        if (!player.hasCard(move)) {
            throw new Error(`Invalid move: ${player.name} does not have the card ${move.name}.`);
        }

        player.removeCard(move);

        // Record the move.
        this.roundMoves.push({ player, move });
        console.log(`${player.name} played ${move.name || move}.`);

        // After processing the move, switch turns.
        turnManager.switchTurn();

        if (this.roundMoves.length === this.turnManager.players.length) {
            this.endRound();
        } else {
            console.log(`It is now ${this.turnManager.getCurrentPlayer().name}'s turn.`);
        }
    }

    endRound() {
        console.log('Round ended. Moves played:', this.roundMoves);

        // Placeholder: determine round winner. Replace with actual Briscas rules.
        const roundWinner = this.roundMoves[0].player;
        console.log(`Round winner is ${roundWinner.name}!`);
    }


    // Utility to check if the round is complete (i.e., all players have made a move).
    isRoundComplete() {
        return this.roundMoves.length === this.players.length;
    }

    // Reset moves for a new round.
    resetRound() {
        this.roundMoves = [];
        console.log('Round reset.');
  }

}