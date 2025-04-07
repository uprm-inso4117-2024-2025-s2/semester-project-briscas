const {v4 : uuidv4} = require("uuid");

// In-memory storage of sessions
const sessions = {};

function createSession() {
  const sessionId = uuidv4();
  sessions[sessionId] = {
    players :
        [], // Each player: { socketId, playerId, connected, timeoutExpiresAt }
    createdAt : Date.now(),
    gameState : null, // Make sure we track gameState per session (optional)
  };
  return sessionId;
}

function joinSession(sessionId, socketId, reconnectingPlayerId = null) {
  const session = sessions[sessionId];
  if (!session)
    return false;

  // Handle reconnection using playerId
  if (reconnectingPlayerId !== null) {
    const player =
        session.players.find(p => p.playerId === reconnectingPlayerId);
    if (player) {
      player.socketId = socketId;
      player.connected = true;
      player.timeoutExpiresAt = null;
      return player;
    }
  }

  // New join (not reconnect)
  const existingPlayer = session.players.find(p => p.socketId === socketId);
  if (!existingPlayer) {
    const newPlayer = {
      socketId,
      playerId : session.players.length + 1,
      connected : true,
      timeoutExpiresAt : null,
    };
    session.players.push(newPlayer);
    return newPlayer;
  } else {
    existingPlayer.connected = true;
    existingPlayer.timeoutExpiresAt = null;
    return existingPlayer;
  }
}

function getSession(sessionId) { return sessions[sessionId] || null; }

function getAllSessions() { return sessions; }

module.exports = {
  createSession,
  joinSession,
  getSession,
  getAllSessions,
};
