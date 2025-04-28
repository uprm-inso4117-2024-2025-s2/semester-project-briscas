open util/ordering[Rank]

// Define Briscas suits
abstract sig Suit {}
one sig Oros, Copas, Espadas, Bastos extends Suit {}

// Define Briscas ranks
abstract sig Rank {}
one sig As, Two, Tres, Four, Five, Six, Seven, Sota, Caballo, Rey extends Rank {}

// A Card contains a single suit, a single rank, and belongs to a single deck. 
sig Card {
  suit: one Suit,
  rank: one Rank,
  deck: one Deck
}

fact UniqueCardCombinations{
  // There must be one Card per Suit x Rank combination
  all s: Suit| all r: Rank | one c: Card | 
    c.suit = s and c.rank = r
}

run showCards {} for exactly 40 Card, exactly 4 Suit, exactly 10 Rank

// A Deck contains a set of unique Card atoms.
sig Deck {
  cards: set Card
} {
  cards = this.~deck
}

run showOneDeck {} for exactly 1 Deck, exactly 40 Card, exactly 4 Suit, exactly 10 Rank

// fact DeckTotal {
//   all d: Deck | #d.cards = 40
// }

// // fact UniqueCardCombinationsPerDeck{
// //   // Every deck must have one Card per Suit x Rank combination.
// //   all d: Deck |
// //     all s: Suit, r: Rank |
// //       one c: d.cards | c.suit = s and c.rank = r
// // }

// run showTwoDecks {} for exactly 2 Deck, exactly 80 Card, exactly 4 Suit, exactly 10 Rank