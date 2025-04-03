const {Server} = require("socket.io");
const {createSession, joinSession, getSession, getAllSessions} =
    require("./sessionManager");

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
      const {sessionId} = data;
      const joined = joinSession(sessionId, socket.id);

      if (joined) {
        socket.emit("sessionJoined", {
          type : "SESSION_JOINED",
          payload : {sessionId},
        });
        console.log(`[SESSION] ${socket.id} joined session ${sessionId}`);
      } else {
        socket.emit("error", {
          type : "SESSION_JOIN_FAILED",
          payload : {message : "Invalid or non-existent session ID."},
        });
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

          break; // No need to continue once we've found and handled the player
        }
      }
    });
  });

  return io;
}

module.exports = initializeSocketServer;
