Feature: Game Logic for Single-Player Briscas

  # Scenario 1: Game initialization
  Scenario: Game initialization sets up game state correctly
    Given a new game is started
    When the game is initialized
    Then the game state should be "New Game"
    And the deck should contain 39 cards
    And a trump card should be set

  # Scenario 2: Card comparison with same suit
  Scenario: Card comparison returns correct result when both cards are non-trump and of the same suit
    Given a card with rank "1" and suit "Oros" is created
    And another card with rank "3" and suit "Oros" is created
    And the trump suit is "Copas"
    When we compare the first card against the second
    Then the first card should beat the second card

  # Scenario 3: Round Manager determines winner and updates scores
  Scenario: Round Manager determines the round winner correctly
    Given a round manager with trump suit "Copas" is created
    And player "player1" plays a card with rank "1" and suit "Oros"
    And player "player2" plays a card with rank "3" and suit "Oros"
    When we determine the round winner
    Then the round winner should be "player1"
    And the scores should be updated with total round points 21

  # Scenario 4: Valid player card play
  Scenario: Player plays a valid card
    Given a player with a hand containing a card with rank "5" and suit "Espadas"
    When the player plays the card with rank "5" and suit "Espadas"
    Then the player's hand should not contain a card with rank "5" and suit "Espadas"
    And it should no longer be the player's turn

  # Scenario 5: Player draws a card
  Scenario: Player draws a card successfully
    Given a player with an empty hand and it is their turn to draw
    When the player draws a card with rank "7" and suit "Bastos"
    Then the player's hand should contain a card with rank "7" and suit "Bastos"
    And drawing should no longer be allowed

  # Scenario 6: Attempt invalid card play
  Scenario: Player attempts to play a card not in hand and gets an error
    Given a player with a hand containing a card with rank "10" and suit "Bastos"
    When the player attempts to play a card with rank "1" and suit "Oros"
    Then an error with message "Card is not in players hand." should be thrown

