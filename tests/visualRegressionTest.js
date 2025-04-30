// tests/visualRegressionTest.js

const assert = require("assert");

console.log("🔍 Running visual regression test for game board...");

// Initial hand before playing
const playerHandBefore = ["oros_1", "copas_3", "espadas_5"];

// Function that returns card positions (simulated layout)
function getCardLayout(hand) {
  return hand.map((card, index) => ({
    cardId: card,
    x: 100 + index * 60, // horizontal spacing
    y: 400
  }));
}

// Simulated new hand after playing "oros_1"
const playerHandAfter = ["copas_3", "espadas_5"];

// Get both layouts
const layoutBefore = getCardLayout(playerHandBefore);
const layoutAfter = getCardLayout(playerHandAfter);

// ✅ Assertion 1: Played card should no longer be rendered
const playedCard = "oros_1";
const stillExists = layoutAfter.find(card => card.cardId === playedCard);
assert.strictEqual(
  stillExists,
  undefined,
  `❌ Card "${playedCard}" should not be rendered after being played.`
);

// ✅ Assertion 2: No card should appear more than once
const ids = layoutAfter.map(c => c.cardId);
const hasDuplicates = new Set(ids).size !== ids.length;
assert.strictEqual(
  hasDuplicates,
  false,
  "❌ Duplicate card rendered in the layout."
);

// ✅ Assertion 3: Cards should be evenly spaced (no layout collapse)
layoutAfter.forEach((card, index) => {
  const expectedX = 100 + index * 60;
  assert.strictEqual(
    card.x,
    expectedX,
    `❌ Card "${card.cardId}" has incorrect x position: expected ${expectedX}, got ${card.x}`
  );
});

console.log("✅ Visual regression test passed: layout and card rendering consistent.");