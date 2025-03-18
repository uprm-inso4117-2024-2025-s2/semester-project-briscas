const Card = require("./Card");

class RoundManager {
  constructor(trumpSuit, amount_players) {
    this.trumpSuit = trumpSuit;
    this.playedCards = {}; // { player1: Card, player2: Card }
    this.scores = { player1: 0, player2: 0, player3: 0, player4:0};
    this.amount_players = amount_players;
  }

  playCard(player, card) {
    if (!card || !(card instanceof Card)) {
      throw new Error("Invalid card played.");
    }
    this.playedCards[player] = card;
  }

  determineWinner() {
    const { player1, player2, player3, player4 } = this.playedCards;
    if(this.amount_players == 4){
      if (!player1 || !player2 || !player3 || !player4) {
        throw new Error(
          "All players must play a card before determining the winner."
        );
      }
      let winner;
      if (player1.beats(player2, this.trumpSuit) && player1.beats(player3, this.trumpSuit) && player1.beats(player4, this.trumpSuit)) {
        winner = "player1";
      } else {
          if (player2.beats(player1, this.trumpSuit) && player2.beats(player3, this.trumpSuit) && player2.beats(player4, this.trumpSuit))
            winner = "player2";
          else {
            if (player3.beats(player1, this.trumpSuit) && player3.beats(player2, this.trumpSuit) && player3.beats(player4, this.trumpSuit))
              winner = "player3";
            else {
              if (player4.beats(player1, this.trumpSuit) && player4.beats(player2, this.trumpSuit) && player4.beats(player3, this.trumpSuit))
                winner = "player4";
          }
        }
      }
      this.updateScore(winner);
      this.resetRound();
      return winner;
    }
    if(this.amount_players == 3){
      if (!player1 || !player2 || !player3) {
        throw new Error(
          "All players must play a card before determining the winner."
        );
      }
      let winner;
      if (player1.beats(player2, this.trumpSuit) && player1.beats(player3, this.trumpSuit)) {
        winner = "player1";
      } else {
          if (player2.beats(player1, this.trumpSuit) && player2.beats(player3, this.trumpSuit))
            winner = "player2";
          else {
            if (player3.beats(player1, this.trumpSuit) && player3.beats(player2, this.trumpSuit))
              winner = "player3";
        }
      }
      this.updateScore(winner);
      this.resetRound();
      return winner;
    }
    if (!player1 || !player2) {
      throw new Error(
        "Both players must play a card before determining the winner."
      );
    }

    let winner;
    if (player1.beats(player2, this.trumpSuit)) {
      winner = "player1";
    } else {
      winner = "player2";
    }

    this.updateScore(winner);
    this.resetRound();
    return winner;
  }

  updateScore(winner) {
    const roundPoints =
      this.playedCards.player1.points + this.playedCards.player2.points;
    this.scores[winner] += roundPoints;
  }

  resetRound() {
    this.playedCards = {}; // Reset played cards for the next round
  }

  getRoundWinnerData() {
    return {
      winner: this.determineWinner(),
      scores: this.scores,
    };
  }
  GameWinner(){

    if(this.scores["player1"] > this.scores["player2"] && this.scores["player1"] > this.scores["player3"] && this.scores["player1"] > this.scores["player4"]){
        return "player1";}

    if(this.scores["player2"] > this.scores["player1"] && this.scores["player2"] > this.scores["player3"] && this.scores["player2"] > this.scores["player4"]){
      return "player2";}

    if(this.scores["player3"] > this.scores["player1"] && this.scores["player3"] > this.scores["player2"] && this.scores["player3"] > this.scores["player4"]){
      return "player3";}

    if(this.scores["player4"] > this.scores["player1"] && this.scores["player4"] > this.scores["player2"] && this.scores["player4"] > this.scores["player3"]){
      return "player4";}
    // if(this.scores["player1"] == this.scores["player2"]){
    return "tie";
    //}
        
      
    }
  };


// Export the RoundManager class for use in the game
module.exports = RoundManager;
