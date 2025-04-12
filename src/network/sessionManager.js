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

function leaveSession(sessionId) {
  const session = sessions[sessionId];
  if (!session)
    return false;

  const player = session.players.find(p => p.socketId === p.socketId);
  if (player) {
    player.connected = false;
    // Players timeout after 15 seconds.
    player.timeoutExpiresAt = Date.now() + 15000;

    // If all players disconnect, destroy session
    const closeSession = session.players.every(p => !p.connected);
    if (closeSession) {
      destroySession(sessionId);
    }
  }
}

function getSession(sessionId) { return sessions[sessionId] || null; }

function getAllSessions() { return sessions; }

function destroySession(sessionId) {
  delete sessions[sessionId];
}

module.exports = {
  createSession,
  joinSession,
  leaveSession,
  getSession,
  getAllSessions,
  destroySession
};
