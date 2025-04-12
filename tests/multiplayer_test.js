const { io } = require("socket.io-client");

const socket = io("http://127.0.0.1:3000");

socket.on("connect", () => {
  console.log(`✅ Connected as ${socket.id}`);

  // Emit a request to create a session
  socket.emit("createSession");
});

// When the server responds with a new session ID
socket.on("sessionCreated", (msg) => {
  const sessionId = msg.payload.sessionId;
  console.log("🆕 Session Created:", sessionId);

  // Immediately try to join the session
  socket.emit("joinSession", { sessionId });
});

socket.on("sessionJoined", (msg) => {
  console.log("✅ Successfully joined session:", msg.payload.sessionId);

  setTimeout(() => {
    // Leave session 2 seconds after joining
    console.log("👋 Leaving session:", msg.payload.sessionId);
    socket.emit("leaveSession", { sessionId: msg.payload.sessionId });

    setTimeout(() => {
      console.log("🗑️  Session is being destroyed:", msg.payload.sessionId);
      socket.emit("destroySession", { sessionId: msg.payload.sessionId });
    
      console.log("🔌 Disconnected from server");
      socket.disconnect();
    }, 1000);
  }, 2000);
});

socket.on("error", (msg) => {
  console.error("❌ Error:", msg.payload.message);
});
