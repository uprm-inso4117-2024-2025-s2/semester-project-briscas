const { v4: uuidv4 } = require("uuid");

// In-memory storage of sessions
const sessions = {};

function createSession() {
  const sessionId = uuidv4();
  sessions[sessionId] = {
    players: [], // Just stores socket IDs for now
    createdAt: Date.now(),
  };
  return sessionId;
}

function joinSession(sessionId, socketId) {
  const session = sessions[sessionId];
  if (!session) return false;

  if (!session.players.includes(socketId)) {
    session.players.push(socketId);
  }

  return true;
}

function getSession(sessionId) {
  return sessions[sessionId] || null;
}

module.exports = {
  createSession,
  joinSession,
  getSession,
};
