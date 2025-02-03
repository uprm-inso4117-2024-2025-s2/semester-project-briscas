//Create sample player class to get started
//Later  we will use the oficial player class and import it to this file

class Player {
    constructor(id,name,hand=[]){
        this.id =id;
        this.name = name;
        this.hand = hand;
        this.score = 0;
    }

    hasCard(card) {
        return this.hand.some(c => c.id === card.id);
      }
    
      // Removes a card from the player's hand.
      removeCard(card) {
        const index = this.hand.findIndex(c => c.id === card.id);
        if (index === -1) {
          throw new Error(`${this.name} does not have the card ${card.name}.`);
        }
        this.hand.splice(index, 1);
      }

}

class TurnManager {
    // Initialize the turn manager
    constructor(player1,player2) {
        this.players = [player1,player2];
        this.player1 = player1;
        this.player2 = player2;
        
        this.currentTurnIndex = Math.floor(Math.random() * 2);
    }

    // Get Player that is supposed to play a card
    getCurrentPlayer() {
        return this.players[this.currentTurnIndex];
    }

    // Check if it is a players turn
    isTurn(player) {
        return this.getCurrentPlayer().id == player.id
    }

    // Switch turn to the next player.
    switchTurn() {
        this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length;
        console.log(`Turn switched. It is now ${this.getCurrentPlayer().name}'s turn.`);
    }

}
// Export the classes using ES Modules syntax.
export { Player, TurnManager };