const { Server } = require("socket.io");
const { createSession, joinSession, getSession, removePlayerFromSession } = require("./sessionManager");
const { validatePlayerAction, routePlayerAction } = require("./actionHandler");

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
      const { sessionId } = data;
      const joined = joinSession(sessionId, socket.id);

      if (joined) {
        socket.emit("sessionJoined", {
          type: "SESSION_JOINED",
          payload: { sessionId },
        });
        console.log(`[SESSION] ${socket.id} joined session ${sessionId}`);
      } else {
        socket.emit("error", {
          type: "SESSION_JOIN_FAILED",
          payload: { message: "Invalid or non-existent session ID." },
        });
      }
    });

    socket.on("playerAction", (data) => {
      const { sessionId, action } = data;
      if (validatePlayerAction(sessionId, socket.id, action)) {
        routePlayerAction(sessionId, socket.id, action);
        console.log(`[ACTION] Valid action from ${socket.id} in session ${sessionId}`);
      } else {
        socket.emit("error", {
          type: "INVALID_ACTION",
          payload: { message: "Invalid or unauthorized action." },
        });
        console.warn(`[ACTION] Invalid action attempted by ${socket.id}`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`[SOCKET] Disconnected: ${socket.id}`);
      removePlayerFromSession(socket.id)
    });
  });

  return io;
}

module.exports = initializeSocketServer;
