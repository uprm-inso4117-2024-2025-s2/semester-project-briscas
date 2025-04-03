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

function removePlayerFromSession(socketId) {
  for (const sessionId in sessions) {
    const session = sessions[sessionId];
    const index = session.players.indexOf(socketId);
    if (index !== -1) {
      session.players.splice(index, 1);
      console.log(`[SESSION] Removed ${socketId} from session ${sessionId}`);
      break;
    }
  }
}

module.exports = {
  createSession,
  joinSession,
  getSession,
  removePlayerFromSession, // New export
};