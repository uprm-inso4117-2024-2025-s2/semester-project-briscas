const { Server } = require("socket.io");
const { createSession, joinSession, getSession } = require("./sessionManager");

// In-memory store for disconnected players' state
const disconnectedPlayers = {};

function initializeSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`[SOCKET] Client connected: ${socket.id}`);

    socket.on("createSession", () => {
      const sessionId = createSession();
      socket.emit("sessionCreated", {
        type: "SESSION_CREATED",
        payload: { sessionId },
      });
      console.log(`[SESSION] Created: ${sessionId}`);
    });

    socket.on("joinSession", (data) => {
      const { sessionId, playerId } = data;
      const joined = joinSession(sessionId, socket.id, playerId);
      if (joined) {
        // Save the player's unique identifier and session ID in the socket for later reference
        socket.playerId = playerId;
        socket.sessionId = sessionId;
        socket.emit("sessionJoined", {
          type: "SESSION_JOINED",
          payload: { sessionId, playerId },
        });
        console.log(
          `[SESSION] Player ${playerId} joined session ${sessionId} with socket ${socket.id}`
        );
      } else {
        socket.emit("error", {
          type: "SESSION_JOIN_FAILED",
          payload: { message: "Invalid or non-existent session ID." },
        });
      }
    });

    // Reconnection handler
    socket.on("reconnect_request", (data) => {
      const { sessionId, playerId } = data;
      if (!sessionId || !playerId) {
        socket.emit("error", {
          type: "RECONNECT_FAILED",
          payload: { message: "Missing sessionId or playerId." },
        });
        return;
      }

      const session = getSession(sessionId);
      if (!session) {
        socket.emit("error", {
          type: "RECONNECT_FAILED",
          payload: { message: "Session does not exist." },
        });
        return;
      }

      const savedState = disconnectedPlayers[playerId];
      if (!savedState) {
        socket.emit("error", {
          type: "RECONNECT_FAILED",
          payload: { message: "No saved state found for player." },
        });
        return;
      }

      // Validate that the saved state belongs to the same session
      if (savedState.sessionId !== sessionId) {
        socket.emit("error", {
          type: "RECONNECT_FAILED",
          payload: { message: "Session mismatch for the provided player." },
        });
        return;
      }

      // Reassign the player's unique identifier and session ID to the new socket
      socket.playerId = playerId;
      socket.sessionId = sessionId;
      // Optionally update your session manager with the new socket.id if necessary

      // Remove the player's state from the disconnected store as they've reconnected
      delete disconnectedPlayers[playerId];

      socket.emit("reconnect_success", {
        type: "RECONNECT_SUCCESS",
        payload: { message: "Reconnected successfully", state: savedState },
      });

      // Notify other players in the session about the reconnection
      socket.to(sessionId).emit("player_reconnected", { playerId });
      console.log(
        `[SESSION] Player ${playerId} reconnected to session ${sessionId} with socket ${socket.id}`
      );
    });

    socket.on("disconnect", () => {
      console.log(`[SOCKET] Disconnected: ${socket.id}`);
      // When a player disconnects, save their state if they have a playerId and sessionId
      if (socket.playerId && socket.sessionId) {
        // Replace these dummy values with your actual state retrieval logic
        const state = {
          hand: [],       // e.g., getPlayerHand(socket.playerId)
          score: 0,       // e.g., getPlayerScore(socket.playerId)
          isTurn: false,  // e.g., checkIfPlayerTurn(socket.playerId)
          sessionId: socket.sessionId  // Store sessionId to ensure proper reconnection
        };
        disconnectedPlayers[socket.playerId] = state;
        console.log(
          `[SESSION] Saved state for disconnected player ${socket.playerId} in session ${socket.sessionId}`
        );
      }
    });
  });

  return io;
}

module.exports = initializeSocketServer;
