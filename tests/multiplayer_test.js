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
});

socket.on("error", (msg) => {
  console.error("❌ Error:", msg.payload.message);
});

socket.on("disconnect", () => {
  console.log("🔌 Disconnected from server");
});
