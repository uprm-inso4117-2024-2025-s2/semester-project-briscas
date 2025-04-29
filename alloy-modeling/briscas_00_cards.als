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
}

fact {
  // There must be one card per suit x rank combination
  all s: Suit| all r: Rank | one c: Card | 
    c.suit = s and c.rank = r
}

run showCards {} for exactly 40 Card, exactly 4 Suit, exactly 10 Rank