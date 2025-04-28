const GameManager = require("../models/GameManager");
const Card = require("../models/Card");

describe("GameManager.validateAction", () => {
  test("should reject playing a card when it's not the player's turn", () => {
    const game = new GameManager(["Alice", "Bob"], "Player", "Oros");
    game.currentTurnIndex = 0;

    const cardFromBob = game.getPlayers()[1].hand[0];
    const result = game.validateAction(1, cardFromBob);
    expect(result.valid).toBe(false);
    expect(result.reason.toLowerCase()).toContain("not your turn");
  });

  test("should reject a card that is not in the player's hand", () => {
    const game = new GameManager(["Alice", "Bob"], "Player", "Copas");

    const fakeCard = new Card("FakeSuit", 99); // guaranteed fake
    const result = game.validateAction(0, fakeCard);
    expect(result.valid).toBe(false);
    expect(result.reason.toLowerCase()).toContain("not in hand");
  });

  test("should accept a valid card from the current player", () => {
    const game = new GameManager(["Alice", "Bob"], "Player", "Bastos");
    const aliceCard = game.getPlayers()[0].hand[0];
    const result = game.validateAction(0, aliceCard);
    expect(result.valid).toBe(true);
  });

  test("should reject a dynamically generated card that is not in hand", () => {
    const game = new GameManager(["Alice", "Bob"], "Player", "Copas");
    const hand = game.getPlayers()[0].hand;

    const allSuits = ["Oros", "Copas", "Espadas", "Bastos"];
    let fakeCard;

    // Loop until we find a card not in hand
    do {
      const suit = allSuits[Math.floor(Math.random() * allSuits.length)];
      const value = Math.floor(Math.random() * 12) + 1;
      fakeCard = new Card(suit, value);
    } while (
      hand.some((c) => c.suit === fakeCard.suit && c.value === fakeCard.value)
    );

    const result = game.validateAction(0, fakeCard);
    expect(result.valid).toBe(false);
    expect(result.reason.toLowerCase()).toContain("not in hand");
  });
});
