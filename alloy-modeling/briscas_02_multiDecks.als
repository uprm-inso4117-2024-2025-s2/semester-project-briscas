open util/ordering[Rank]
open util/ordering[Card]

// Suits
abstract sig Suit {}
one sig Oros, Copas, Espadas, Bastos extends Suit {}

// Ranks
abstract sig Rank {}
one sig Dos, Cuatro, Cinco, Seis, Siete, Sota, Caballo, Rey, Tres, As extends Rank {}

// CardType: An abstract card definition to manage Suit x Rank combinations
sig CardType {
  suit: one Suit,
  rank: one Rank
}

// Card: A physical definition of a Card entity. 
sig Card {
  combination: one CardType,
  deck: one Deck
}

// Deck: A collection of Card(s).
sig Deck {
  cards: set Card
} {
  cards = this.~deck
}

fact UniqueCardCombinations{
  // There must be only one CardType for each Suit x Rank combination (40 possibilities)
  all s: Suit, r: Rank | one t: CardType | 
    t.suit = s and t.rank = r
}

fact UniqueCardsInDeck {
  // Every Deck must have exactly one Card per CardType.
  all d: Deck |
    all t: CardType |
      one c: d.cards | c.combination = t
}

fact CardDeckOwnership {
  // Every Card must belong to one Deck.
  all c: Card | one c.deck
}

run showOneDeck {} for exactly 1 Deck, exactly 40 CardType, exactly 40 Card, exactly 4 Suit, exactly 10 Rank

run showTwoDecks {} for exactly 2 Deck, exactly 40 CardType, exactly 80 Card, exactly 4 Suit, exactly 10 Rank

check countTwoDecks {all d: Deck | #d.cards = 40} for exactly 2 Deck, exactly 40 CardType, exactly 80 Card, exactly 4 Suit, exactly 10 Rank

run showThreeDecks {} for exactly 3 Deck, exactly 40 CardType, exactly 120 Card, exactly 4 Suit, exactly 10 Rank

check countThreeDecks {all d: Deck | #d.cards = 40} for exactly 3 Deck, exactly 40 CardType, exactly 120 Card, exactly 4 Suit, exactly 10 Rank