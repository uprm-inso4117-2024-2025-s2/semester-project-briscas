const { Server } = require("socket.io");
const {
  createSession,
  joinSession,
  leaveSession,
  getSession,
  getAllSessions,
  destroySession,
  handlePlayerMoves,
  getSocketIdSession,
} = require("./sessionManager");

const GameState = require("../../models/GameState");

// In-memory store for disconnected players' state (for reconnect_request)
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

    // SESSION CREATION
    socket.on("createSession", () => {
      const sessionId = createSession();
      socket.emit("sessionCreated", {
        type: "SESSION_CREATED",
        payload: { sessionId },
      });
      console.log(`[SESSION] Created: ${sessionId}`);
    });

    // JOIN SESSION (Normal or Reconnect via playerId)
    socket.on("joinSession", (data) => {
      const { sessionId, playerId } = data;
      const player = joinSession(sessionId, socket.id, playerId);

      if (player) {
        socket.playerId = player.playerId;
        socket.sessionId = sessionId;

        socket.emit("sessionJoined", {
          type: "SESSION_JOINED",
          payload: {
            sessionId,
            playerId: player.playerId,
          },
        });

        console.log(
          `[SESSION] Player ${player.playerId} joined session ${sessionId} with socket ${socket.id}`
        );

        // Check if game can be resumed
        const session = getSession(sessionId);
        if (session && session.gameState) {
          const game = session.gameState;
          const allConnected = session.players.every((p) => p.connected);

          if (game.GetGameState() === "Interrupted" && allConnected) {
            game.restoreGameState(); // restore if needed
            game.ChangeGameState("Playing");
            console.log(`[GAME] Resuming game for session ${sessionId}`);

            session.players.forEach((p) => {
              io.to(p.socketId).emit("gameResumed", {
                message: "Game resumed – all players reconnected.",
                gameState: game.GetGameState(),
              });
            });
          }
        }
      } else {
        socket.emit("error", {
          type: "SESSION_JOIN_FAILED",
          payload: { message: "Invalid or non-existent session ID." },
        });
      }
    });

    // 🔧 MOCK: Attach GameState to session for testing
    socket.on("mockAttachGameState", ({ sessionId }) => {
      const session = getSession(sessionId);
      if (session && !session.gameState) {
        session.gameState = new GameState();
        session.gameState.ChangeGameState("Playing");
        console.log(`[MOCK] GameState attached to session ${sessionId}`);
      }
    });

    // 🔁 RECONNECT REQUEST via stored player state
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

      if (savedState.sessionId !== sessionId) {
        socket.emit("error", {
          type: "RECONNECT_FAILED",
          payload: { message: "Session mismatch for the provided player." },
        });
        return;
      }

      socket.playerId = playerId;
      socket.sessionId = sessionId;

      delete disconnectedPlayers[playerId];

      socket.emit("reconnect_success", {
        type: "RECONNECT_SUCCESS",
        payload: { message: "Reconnected successfully", state: savedState },
      });

      socket.to(sessionId).emit("player_reconnected", { playerId });

      console.log(
        `[SESSION] Player ${playerId} reconnected to session ${sessionId} with socket ${socket.id}`
      );
    });

    // ❌ HANDLE DISCONNECT
    socket.on("disconnect", () => {
      console.log(`[SOCKET] Disconnected: ${socket.id}`);

      const allSessions = getAllSessions();

      for (const sessionId in allSessions) {
        const session = allSessions[sessionId];
        if (!session || !session.players) continue;

        const player = session.players.find((p) => p.socketId === socket.id);
        if (player) {
          player.connected = false;
          player.timeoutExpiresAt = Date.now() + 60000;

          console.log(
            `[DEBUG] Player state after disconnect:`,
            JSON.stringify(player, null, 2)
          );

          // Save reconnectable state (if needed)
          disconnectedPlayers[player.playerId] = {
            hand: [], // TODO: populate from gameState
            score: 0,
            isTurn: false,
            sessionId: sessionId,
          };

          if (session.gameState) {
            const game = session.gameState;
            game.handlePlayerDisconnection(player.playerId);

            const connectedPlayers = session.players.filter((p) => p.connected);
            if (connectedPlayers.length < 2) {
              game.ChangeGameState("Interrupted");

              session.players.forEach((p) => {
                if (p.connected) {
                  io.to(p.socketId).emit("gamePaused", {
                    reason: "Player disconnected",
                    players: session.players.map((p) => ({
                      playerId: p.playerId,
                      connected: p.connected,
                      timeoutExpiresAt: p.timeoutExpiresAt,
                    })),
                  });
                }
              });
            }
          }

          break;
        }
      }
    });

    socket.on("getSocketIdSession", ({ socketId }) => {
      getSocketIdSession(socketId);
    });

    socket.on("handlePlayerMoves", ({ sessionId, playerId, card }) => {
      handlePlayerMoves(sessionId, playerId, card);
    });

    socket.on("leaveSession", ({ sessionId }) => {
      leaveSession(sessionId, socket.id);
    });

    socket.on("destroySession", ({ sessionId }) => {
      destroySession(sessionId);
    });
  });

  return io;
}

module.exports = initializeSocketServer;