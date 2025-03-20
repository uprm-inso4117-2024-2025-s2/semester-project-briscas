
const Card = require('../models/Card');
const Deck = require('../models/Deck');
const GameManager = require('../models/GameManager');
const GameState = require('../models/GameState');
const RoundManager = require('../models/Winner')

const suits = ["Oros", "Copas", "Espadas", "Bastos"];
const ranks = ["1", "2", "3", "4", "5", "6", "7", "10", "11", "12"];
function strcmp(a, b)
{   
    return (a<b?-1:(a>b?1:0));  
}
function SameCard(deck4){
  return (deck4.trumpCard.rank == card.rank && deck4.trumpCard.suit == card.suit)
}
function IsSuit(suit){
  index = 0;
  for(i = 0; i < suits.length; i++){
    if(strcmp(suits[i], suit) == 0){
      index = i;
    }
  }
  return index;
}
function IsRank(rank){
  index = 0;
  for(k = 0; k < ranks.length; k++){
    if(strcmp(ranks[k], rank) == 0){
      index = k;
    }
  }
  return index;
}

function SameDeck(deck2){
  deck = new Deck;
  return (JSON.stringify(deck2.deck) != JSON.stringify(deck.deck)) && CheckDeck(deck2);
}
function InDeck(deck, i, j){
  result = false;
  deck.deck.forEach(element => {
    card = new Card();
    if(element == null){
      result = false;
    }
    else{
    card.rank = ranks[j];
    card.suit = suits[i];

     if(element.rank == card.rank && element.suit == card.suit){
      result = true;
    }}
  });
  return result;
};

function CheckDeck(deck){
  count = 0;
    for( i = 0; i<suits.length; i++){
      for(j = 0; j < ranks.length; j++){
        if(InDeck(deck, i, j)){
          count++;
        }
    }
  }
  return (count == 40);
};

function CheckWinner(deck, roundManager){
    result = false;
    count = 0;
    check = ""
    for(i = 0; i < 19; i++){
        player_1 = deck.draw();
        player_2 = deck.draw();
        win = player_1.beats(player_2, deck.getTrumpSuit);
        if(win){
            check = "player1"
        }
        else{
            check = "player2"
        }

        roundManager.playCard("player1", player_1);
        roundManager.playCard("player2", player_2);
        if(strcmp(roundManager.determineWinner(), check) == 0){
            count++;
        }
    }
    player_1 = deck.draw();
    player_2 = deck.getTrumpCard();
    win = player_1.beats(player_2, deck.getTrumpSuit);
    if(win){
        check = "player1"
    }
    else{
        check = "player2"
    }

    roundManager.playCard("player1", player_1);
    roundManager.playCard("player2", player_2);
    if(strcmp(roundManager.determineWinner(), check) == 0){
        count++;
    }

    if(count == 20){
        result = true;
    }


    return result;
};

function CheckPoints(deck, roundManager){
      result = false;
      count = 0;
      count_2 = 0;
      check = ""
      for(i = 0; i < 19; i++){
          player_1 = deck.draw();
          player_2 = deck.draw();
          win = player_1.beats(player_2, deck.getTrumpSuit);
          if(win){
              check = "player1"
              if(IsRank(player_1.rank) == 0){
                count += 11;
              }
              if(IsRank(player_1.rank) == 2){
              count += 10
              }
              if(IsRank(player_1.rank) == 7){
                count += 2}
              if(IsRank(player_1.rank) == 8){
                count += 3}
              if(IsRank(player_1.rank) == 9){
                count += 4}
              if(IsRank(player_2.rank) == 0){
                count += 11;
                }
              if(IsRank(player_2.rank) == 2){
                count += 10
                }
              if(IsRank(player_2.rank) == 7){
                count += 2}
              if(IsRank(player_2.rank) == 8){
                count += 3}
              if(IsRank(player_2.rank) == 9){
                count += 4}


          }
          else{
              check = "player2"
              if(IsRank(player_2.rank) == 0){
                count_2 += 11;
              }
              if(IsRank(player_2.rank) == 2){
                count_2 += 10
              }
              if(IsRank(player_2.rank) == 7){
                count_2 += 2}
              if(IsRank(player_2.rank) == 8){
                count_2 += 3}
              if(IsRank(player_2.rank) == 9){
                count_2 += 4}
              if(IsRank(player_1.rank) == 0){
                    count_2 += 11;
                  }
               if(IsRank(player_1.rank) == 2){
                    count_2 += 10
                  }
               if(IsRank(player_1.rank) == 7){
                    count_2 += 2}
               if(IsRank(player_1.rank) == 8){
                    count_2 += 3}
               if(IsRank(player_1.rank) == 9){
                    count_2 += 4}
          }
  
          roundManager.playCard("player1", player_1);
          roundManager.playCard("player2", player_2);
          roundManager.determineWinner();
          if(count == roundManager.scores["player1"] && count_2 == roundManager.scores["player2"]){
        }
        else{
            result = false;
            return result;
        }

      }
      player_1 = deck.draw();
      player_2 = deck.getTrumpCard();
      win = player_1.beats(player_2, deck.getTrumpSuit);
      if(win){
          check = "player1"
          if(IsRank(player_1.rank) == 0){
            count += 11;
          }
          if(IsRank(player_1.rank) == 2){
          count += 10
          }
          if(IsRank(player_1.rank) == 7){
            count += 2}
          if(IsRank(player_1.rank) == 8){
            count += 3}
          if(IsRank(player_1.rank) == 9){
            count += 4}
          if(IsRank(player_2.rank) == 0){
            count += 11;
            }
          if(IsRank(player_2.rank) == 2){
            count += 10
            }
          if(IsRank(player_2.rank) == 7){
            count += 2}
          if(IsRank(player_2.rank) == 8){
            count += 3}
          if(IsRank(player_2.rank) == 9){
            count += 4}
      }
      else{
          check = "player2"
          if(IsRank(player_2.rank) == 0){
            count_2 += 11;
          }
          if(IsRank(player_2.rank) == 2){
            count_2 += 10
          }
          if(IsRank(player_2.rank) == 7){
            count_2 += 2}
          if(IsRank(player_2.rank) == 8){
            count_2 += 3}
          if(IsRank(player_2.rank) == 9){
            count_2 += 4}
          if(IsRank(player_1.rank) == 0){
                count_2 += 11;
              }
           if(IsRank(player_1.rank) == 2){
                count_2 += 10
              }
           if(IsRank(player_1.rank) == 7){
                count_2 += 2}
           if(IsRank(player_1.rank) == 8){
                count_2 += 3}
           if(IsRank(player_1.rank) == 9){
                count_2 += 4}
      }
  
      roundManager.playCard("player1", player_1);
      roundManager.playCard("player2", player_2);
      roundManager.determineWinner();

      if(count == roundManager.scores["player1"] && count_2 == roundManager.scores["player2"]){
          result = true;
      }
  
  
      return result;
  };

function GameWinner(deck, roundManager){
    result = false;
    count = 0;
    count_2 = 0;
    check = ""
    for(i = 0; i < 19; i++){
        player_1 = deck.draw();
        player_2 = deck.draw();
        win = player_1.beats(player_2, deck.getTrumpSuit);
        if(win){
            check = "player1"
            if(IsRank(player_1.rank) == 0){
              count += 11;
            }
            if(IsRank(player_1.rank) == 2){
            count += 10
            }
            if(IsRank(player_1.rank) == 7){
              count += 2}
            if(IsRank(player_1.rank) == 8){
              count += 3}
            if(IsRank(player_1.rank) == 9){
              count += 4}
            if(IsRank(player_2.rank) == 0){
              count += 11;
              }
            if(IsRank(player_2.rank) == 2){
              count += 10
              }
            if(IsRank(player_2.rank) == 7){
              count += 2}
            if(IsRank(player_2.rank) == 8){
              count += 3}
            if(IsRank(player_2.rank) == 9){
              count += 4}


        }
        else{
            check = "player2"
            if(IsRank(player_2.rank) == 0){
              count_2 += 11;
            }
            if(IsRank(player_2.rank) == 2){
              count_2 += 10
            }
            if(IsRank(player_2.rank) == 7){
              count_2 += 2}
            if(IsRank(player_2.rank) == 8){
              count_2 += 3}
            if(IsRank(player_2.rank) == 9){
              count_2 += 4}
            if(IsRank(player_1.rank) == 0){
                  count_2 += 11;
                }
             if(IsRank(player_1.rank) == 2){
                  count_2 += 10
                }
             if(IsRank(player_1.rank) == 7){
                  count_2 += 2}
             if(IsRank(player_1.rank) == 8){
                  count_2 += 3}
             if(IsRank(player_1.rank) == 9){
                  count_2 += 4}
        }

        roundManager.playCard("player1", player_1);
        roundManager.playCard("player2", player_2);
        roundManager.determineWinner();

    }
    player_1 = deck.draw();
    player_2 = deck.getTrumpCard();
    win = player_1.beats(player_2, deck.getTrumpSuit);
    if(win){
        check = "player1"
        if(IsRank(player_1.rank) == 0){
          count += 11;
        }
        if(IsRank(player_1.rank) == 2){
        count += 10
        }
        if(IsRank(player_1.rank) == 7){
          count += 2}
        if(IsRank(player_1.rank) == 8){
          count += 3}
        if(IsRank(player_1.rank) == 9){
          count += 4}
        if(IsRank(player_2.rank) == 0){
          count += 11;
          }
        if(IsRank(player_2.rank) == 2){
          count += 10
          }
        if(IsRank(player_2.rank) == 7){
          count += 2}
        if(IsRank(player_2.rank) == 8){
          count += 3}
        if(IsRank(player_2.rank) == 9){
          count += 4}
    }
    else{
        check = "player2"
        if(IsRank(player_2.rank) == 0){
          count_2 += 11;
        }
        if(IsRank(player_2.rank) == 2){
          count_2 += 10
        }
        if(IsRank(player_2.rank) == 7){
          count_2 += 2}
        if(IsRank(player_2.rank) == 8){
          count_2 += 3}
        if(IsRank(player_2.rank) == 9){
          count_2 += 4}
        if(IsRank(player_1.rank) == 0){
              count_2 += 11;
            }
         if(IsRank(player_1.rank) == 2){
              count_2 += 10
            }
         if(IsRank(player_1.rank) == 7){
              count_2 += 2}
         if(IsRank(player_1.rank) == 8){
              count_2 += 3}
         if(IsRank(player_1.rank) == 9){
              count_2 += 4}
    }

    roundManager.playCard("player1", player_1);
    roundManager.playCard("player2", player_2);
    roundManager.determineWinner();

    gamewiner = "";
    if(count == count_2){
        gamewiner =  "tie";
    }
    if(count > count_2)
        gamewiner = "player1";
    else{
        gamewiner = "player2"
    }

    if(strcmp(roundManager.GameWinner(),gamewiner) == 0){
        result = true;
    }

    return result;
};
describe('UtilityTest', () => {
    test('Determine Winner', () => {
    const deck = new Deck;
    deck.setupTrumpSuit();
    const roundManager = new RoundManager(deck.getTrumpSuit);
    expect(CheckWinner(deck, roundManager)).toEqual(true);
})

test('Final points', () => {
    const deck2 = new Deck;
    deck2.shuffle();
    deck2.setupTrumpSuit();
    const roundManager = new RoundManager(deck2.getTrumpSuit);
    expect(CheckPoints(deck2, roundManager)).toEqual(true);
})

test('Game Winner', () => {
    const deck3 = new Deck;
    deck3.shuffle();
    deck3.setupTrumpSuit();
    const roundManager = new RoundManager(deck3.getTrumpSuit);
    expect(GameWinner(deck3, roundManager)).toEqual(true);
})



  })