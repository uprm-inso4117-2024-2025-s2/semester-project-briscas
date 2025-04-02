const { Server } = require("socket.io");
const { createSession, joinSession, getSession } = require("./sessionManager");

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

    socket.on("disconnect", () => {
      console.log(`[SOCKET] Disconnected: ${socket.id}`);
      // No player/socket mapping logic yet – that's Sub-Issue 2
    });
  });

  return io;
}

module.exports = initializeSocketServer;
