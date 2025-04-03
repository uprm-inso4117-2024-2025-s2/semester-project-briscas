const {v4 : uuidv4} = require("uuid");

// In-memory storage of sessions
const sessions = {};

function createSession() {
  const sessionId = uuidv4();
  sessions[sessionId] = {
    // Store more detailed info instead of just playerId
    players :
        [], // Each player: { socketId, playerId, connected, timeoutExpiresAt }
    createdAt : Date.now(),
  };
  return sessionId;
}

function joinSession(sessionId, socketId) {
  const session = sessions[sessionId];
  if (!session)
    return false;

  const existingPlayer = session.players.find(p => p.socketId === socketId);
  if (!existingPlayer) {
    session.players.push({
      socketId,
      playerId : session.players.length + 1, // player 1, 2, etc.
      connected : true,
      timeoutExpiresAt : null
    });
  } else {
    existingPlayer.connected = true;
    existingPlayer.timeoutExpiresAt = null;
  }

  return true;
}

function getSession(sessionId) { return sessions[sessionId] || null; }

module.exports = {
  createSession,
  joinSession,
  getSession,
};
