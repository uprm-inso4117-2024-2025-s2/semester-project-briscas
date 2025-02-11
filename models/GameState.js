
class GameState {
  constructor() {    
    this.game_states = ["New game", "Round start", "Playing", "Round end", "Game end"];
    this.state = "New game";
    this.turn = ["1","2"];
    this.player_turn = null;
    this.deck = null;
    this.trump_suit = null;
    this.played_cards = [null,null];
    this.scores = [null,null];
    this.player_hands = [null, null];
  }
    ValidState(){
        if(this.state == null){
            console.warn(`Invalid game state: ${this.state}`);
        }
        if(this.state == "Round start" || this.state == "Round end" || this.state == "Playing"){
            if(this.player_turn == null){
                console.warn(`Invalid player turn: null`);}}

        if(this.state == "Round start" || this.state == "Round end" || this.state == "Playing"){
            if(this.deck == null){
                console.warn(`Invalid deck: null`);}}

        if(this.state == "Round start" || this.state == "Round end" || this.state == "Playing"){
            if(this.trump_suit == null){
                console.warn(`Invalid trump suit: null`);}}

        if(this.state == "Round start" || this.state == "Round end" || this.state == "Playing"){
            if(this.played_cards[0] == null || this.played_cards[1] == null){
                console.warn("Invalid played cards: null");}}

        if(this.state == "Round start" || this.state == "Round end" || this.state == "Playing"){
            if(this.scores[0] == null || this.scores[1] == null){
                console.warn("Invalid scores: null");}}

        if(this.state == "Round start" || this.state == "Round end" || this.state == "Playing"){
            if(this.player_hands[0] == null || this.player_hands[1] == null){
                console.warn("Invalid player hands: null");}}
            }

                            
    GetGameState(){
        return this.state;
    }

    ChangeGameState(state){
        if (!this.game_states.includes(state)) {
            console.warn(`Invalid game state: ${state}`);
            this.state = null;
        }
        else{
            this.state = state;
        }
    }
    
    GetTurn(){
        return this.player_turn;
    }
    ChangeTurn(turn){
        if(!this.turn.includes(turn)){
            console.warn(`Invalid player turn: ${turn}`);
            this.player_turn = null;
        }
        else{
            this.player_turn = turn;
        }
    }

    GetDeck(){
        return this.deck;
    }
    ChangeDeck(deck){
        this.deck = deck;
    }

    GetTrumpSuit(){
        return this.trump_suit;
    }
    ChangeTrumpSuit(trump_suit){
        this.trump_suit = trump_suit;
    }

    GetPlayedCards(player){
        return this.played_cards[player];
    }
    ChangePlayedCards(played_cards, played_cards_2){
        this.played_cards[0] = played_cards;
        this.played_cards[1] = played_cards_2;
    }

    GetScores(player){
        return this.scores[player];
    }
    ChangeScores(score, score_2){
        this.scores[0] = score;
        this.scores[1] = score_2;
    }

    GetPlayerHand(player){
        return this.player_hands[player];
    }
    ChangePlayerHands(hand, hand_2){
        this.player_hands[0] = hand;
        this.player_hands[1] = hand_2;
    }
    }

  
  module.exports = GameState;