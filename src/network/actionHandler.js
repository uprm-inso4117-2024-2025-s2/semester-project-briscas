const sessionManager = require("./sessionManager");
const GameManager = require("./GameManager");

const gameInstances = {};

function validatePlayerAction(sessionId, playerId, action) {
  const session = sessionManager.getSession(sessionId);
  if (!session || !session.players.includes(playerId)) return false;
  if (!["PLAY_CARD"].includes(action.type)) return false;
  if (!action.payload || !action.payload.card) return false;
  return true;
}

function routePlayerAction(sessionId, playerId, action) {
  let game = gameInstances[sessionId];

  if (!game) {
    const playerCount = sessionManager.getSession(sessionId).players.length;
    const playerNames = Array(playerCount).fill('Human');
    const turnOrder = Array(playerCount).fill(false).map((_, i) => i === 0);
    const trumpSuit = null;
    game = new GameManager(playerNames, turnOrder, trumpSuit);
    gameInstances[sessionId] = game;
    console.log(`[GAME] New GameManager for session ${sessionId}`);
  }

  const session = sessionManager.getSession(sessionId);
  const playerIndex = session.players.indexOf(playerId);

  try {
    game.playCard(playerIndex, action.payload.card);
    console.log(`[GAME] Player ${playerId} played card in session ${sessionId}`);
  } catch (error) {
    console.error(`[GAME] Error playing card: ${error.message}`);
  }
}

module.exports = { validatePlayerAction, routePlayerAction };
