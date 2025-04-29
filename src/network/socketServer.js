const { Server } = require("socket.io");
const {
  createSession,
  joinSession,
  leaveSession,
  getSession,
  getAllSessions,
  destroySession,
} = require("./sessionManager");

const GameState = require("../../models/GameState");

// In-memory store for disconnected players' state (for reconnect_request)
const disconnectedPlayers = {};

// Helper function to validate player actions
function validateAction(gameState, playerId, action) {
  if (!action || typeof action !== "object" || !action.type || !action.cardId) {
    return false;
  }

  if (gameState.GetTurn() !== String(playerId)) {
    console.warn(`Validation failed: Not player's turn`);
    return false;
  }

  const hand = gameState.GetPlayerHand(playerId - 1);
  if (!hand || !hand.some((card) => card.id === action.cardId)) {
    console.warn(`Validation failed: Card not in hand`);
    return false;
  }

  return true; // Passes all checks
}

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
    //---Functions valid action loadtest---///
    //Alternate mockgame state to hangle playes in load testing session//
    //not for real gamestate,just for a load test

    socket.on("fullMockGameState", ({ sessionId, numPlayers }) => {
      const session = getSession(sessionId);
      if (session) {
        session.gameState = new GameState();
        session.gameState.ChangeGameState("Playing");

        session.gameState.playersHands = {};
        for (let playerId = 1; playerId <= numPlayers; playerId++) {
          session.gameState.playersHands[playerId] = [
            { id: `card-${playerId}-0`, rank: "2", suit: "swords" },
            { id: `card-${playerId}-1`, rank: "5", suit: "cups" },
            { id: `card-${playerId}-2`, rank: "king", suit: "coins" },
          ];
        }

        session.gameState.currentTurn = 1;

        session.gameState.GetTurn = () => String(session.gameState.currentTurn);
        session.gameState.GetPlayerHand = (playerId) =>
          session.gameState.playersHands[playerId + 1];

        console.log(
          `[TEST SETUP] Full GameState initialized for session ${sessionId}`
        );
      }
    });

    socket.on("playerAction", (action) => {
      const session = getSession(socket.sessionId);
      if (!session || !session.gameState) {
        socket.emit("error", {
          type: "INVALID_SESSION",
          payload: { message: "Session not found" },
        });
        return;
      }

      const playerId = socket.playerId;
      if (typeof playerId !== "number") {
        socket.emit("error", {
          type: "INVALID_PLAYER",
          payload: { message: "Invalid player ID" },
        });
        return;
      }

      try {
        if (!validateAction(session.gameState, playerId, action)) {
          throw new Error("Invalid action detected");
        }

        // Apply action (Remove card from hand)
        const playerHand = session.gameState.GetPlayerHand(playerId - 1);
        const cardIndex = playerHand.findIndex((c) => c.id === action.cardId);
        if (cardIndex === -1)
          throw new Error("Card not found in player's hand");
        const playedCard = playerHand.splice(cardIndex, 1)[0];

        console.log(
          `Player ${playerId} played ${playedCard.rank} of ${playedCard.suit}`
        );

        // 🔑 IMPORTANT: Properly update turn on the server side
        session.gameState.currentTurn =
          (session.gameState.currentTurn % 50) + 1;

        socket.emit("actionAccepted", { playerId, action });
      } catch (error) {
        socket.emit("error", {
          type: "INVALID_ACTION",
          payload: { message: error.message },
        });
        socket.emit("resync", { gameState: session.gameState });
      }
    });
    //---Functions valid action loadtest---///

    //---Functions for resync---///

    socket.on("resyncRequest", () => {
      const session = getSession(socket.sessionId);
      if (!session || !session.gameState) {
        socket.emit("error", {
          type: "INVALID_SESSION",
          payload: { message: "Cannot resync, session not found" },
        });
        return;
      }

      console.log(`Resync requested by player ${socket.id}`);
      socket.emit("resync", { gameState: session.gameState });
    });

    //---Functions for resync---///

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
