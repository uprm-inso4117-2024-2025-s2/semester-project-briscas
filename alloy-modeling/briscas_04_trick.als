// === Suits and Ranks ===
abstract sig Suit {}
one sig Oros, Copas, Espadas, Bastos extends Suit {}

abstract sig Rank {}
one sig As, Two, Tres, Four, Five, Six, Seven, Sota, Caballo, Rey extends Rank {}

// === Cards: One per suit-rank combo ===
sig Card {
  suit: one Suit,
  rank: one Rank
}

fact UniqueCards {
  all s: Suit | all r: Rank | one c: Card | c.suit = s and c.rank = r
}

// === Players ===
abstract sig Player {}
one sig Player1, Player2 extends Player {}

// === Trick State ===
sig Trick {
  trump: one Suit,
  hand: Player -> some Card,
  played: Player -> one Card,
  winner: one Player    
}

// === Card Ranking for Trick Resolution ===
fun rankValue[r: Rank]: Int {
  r = As       => 10
  else r = Tres    => 9
  else r = Rey     => 8
  else r = Caballo => 7
  else r = Sota    => 6
  else r = Seven   => 5
  else r = Six     => 4
  else r = Five    => 3
  else r = Four    => 2
  else              1 // Two
}

// === Legal Constraints ===

fact PlayedCardsComeFromHand {
  all t: Trick, p: Player | t.played[p] in t.hand[p]
}

fact EachPlayerHasCards {
  all t: Trick | all p: Player | some t.hand[p]
}

fact ThreeCardHands {
  all t: Trick | all p: Player | #t.hand[p] = 3
}

// === Trick Winner Rules ===
fact ComputeTrickWinner {
  all t: Trick |
    let c1 = t.played[Player1], c2 = t.played[Player2] |
      // Case 1: Same suit — compare rank
      (c1.suit = c2.suit and rankValue[c1.rank] > rankValue[c2.rank]) => t.winner = Player1
      else (c1.suit = c2.suit and rankValue[c2.rank] > rankValue[c1.rank]) => t.winner = Player2
      else (c1.suit = c2.suit and rankValue[c1.rank] = rankValue[c2.rank]) => t.winner = Player1
      // Case 2: Trump vs non-trump
      else (c1.suit = t.trump and c2.suit != t.trump) => t.winner = Player1
      else (c2.suit = t.trump and c1.suit != t.trump) => t.winner = Player2
      // Case 3: Different suits, no trump — first player wins
      else t.winner = Player1
}

// === Show example tricks ===
pred showTrick {
  some t: Trick |
    all p: Player | one t.played[p]
}

run showTrick for exactly 40 Card, exactly 4 Suit, exactly 10 Rank, 2 Player, 1 Trick
