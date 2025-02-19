
const Card = require('../models/Card');
const Deck = require('../models/Deck');

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

describe('UtilityTest', () => {
    test('Full deck', () => {
    const deck = new Deck;
     expect(CheckDeck(deck)).toEqual(true);
    })

    test('Shuffling', () => {
      const deck2 = new Deck;
      deck2.shuffle();
       expect(SameDeck(deck2)).toEqual(true);
      })

    test('Draw', () => {
      const deck3 = new Deck;
      // deck3.shuffle();
      card3 = deck3.draw();
      i = IsSuit(card3.suit)
      j = IsRank(card3.rank);
      expect(InDeck(deck3, i , j)).toEqual(false);
      })
      test('Trump Suit', () => {
        const deck4 = new Deck;
        deck4.shuffle();
        card4 = deck4.setupTrumpSuit();
        i = IsSuit(card4.suit)
        j = IsRank(card4.rank);
        expect(InDeck(deck4, i , j)).toEqual(false);
        expect(SameCard(deck4)).toEqual( true);
        })
  })