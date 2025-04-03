const {Server} = require("socket.io");
const {createSession, joinSession, getSession, getAllSessions} =
    require("./sessionManager");

const GameState = require("../../models/GameState"); // Adjust path as needed

function initializeSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors : {
      origin : "*",
      methods : [ "GET", "POST" ],
    },
  });

  io.on("connection", (socket) => {
    console.log(`[SOCKET] Client connected: ${socket.id}`);

    socket.on("createSession", () => {
      const sessionId = createSession();
      socket.emit("sessionCreated", {
        type : "SESSION_CREATED",
        payload : {sessionId},
      });
      console.log(`[SESSION] Created: ${sessionId}`);
    });

    socket.on("joinSession", (data) => {
      const {sessionId, playerId} = data;
      const player = joinSession(sessionId, socket.id, playerId);

      if (player) {
        socket.emit("sessionJoined", {
          type : "SESSION_JOINED",
          payload : {
            sessionId,
            playerId : player.playerId,
          },
        });
        console.log(`[SESSION] ${socket.id} joined session ${
            sessionId} as player ${player.playerId}`);

        // Check if game can be resumed
        const session = getSession(sessionId);
        if (session && session.gameState) {
          const game = session.gameState;
          const allConnected = session.players.every(p => p.connected);

          if (game.GetGameState() === "Interrupted" && allConnected) {
            game.ChangeGameState("Playing");
            console.log(`[GAME] Resuming game for session ${sessionId}`);

            session.players.forEach(p => {
              io.to(p.socketId).emit("gameResumed", {
                message : "Game resumed – all players reconnected.",
                gameState : game.GetGameState(),
              });
            });
          }
        }
      } else {
        socket.emit("error", {
          type : "SESSION_JOIN_FAILED",
          payload : {message : "Invalid or non-existent session ID."},
        });
      }
    });

    // MOCK: attach a GameState to a session for testing
    socket.on("mockAttachGameState", ({sessionId}) => {
      const session = getSession(sessionId);
      if (session && !session.gameState) {
        session.gameState = new GameState();
        session.gameState.ChangeGameState("Playing");
        console.log(`[MOCK] GameState attached to session ${sessionId}`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`[SOCKET] Disconnected: ${socket.id}`);

      const allSessions = getAllSessions();

      for (const sessionId in allSessions) {
        const session = allSessions[sessionId];
        if (!session || !session.players)
          continue;

        const player = session.players.find(p => p.socketId === socket.id);
        if (player) {
          player.connected = false;
          player.timeoutExpiresAt = Date.now() + 60000;

          console.log(`[DEBUG] Player state after disconnect:`,
                      JSON.stringify(player, null, 2));

          if (session.gameState) {
            const game = session.gameState;
            game.handlePlayerDisconnection(player.playerId);

            const connectedPlayers = session.players.filter(p => p.connected);
            if (connectedPlayers.length < 2) {
              game.ChangeGameState("Interrupted");

              session.players.forEach(p => {
                if (p.connected) {
                  io.to(p.socketId).emit("gamePaused", {
                    reason : "Player disconnected",
                    players : session.players.map(
                        p => ({
                          playerId : p.playerId,
                          connected : p.connected,
                          timeoutExpiresAt : p.timeoutExpiresAt,
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
  });

  return io;
}

module.exports = initializeSocketServer;
