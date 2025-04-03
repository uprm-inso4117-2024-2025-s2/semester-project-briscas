const { io } = require("socket.io-client");

const socket = io("ws://localhost:3000");

socket.on("connect", () => {
  console.log("[PLAYER 1] Connected:", socket.id);

  socket.emit("createSession");

  socket.on("sessionCreated", (data) => {
    const sessionId = data.payload.sessionId;
    console.log("[PLAYER 1] Created session:", sessionId);

    socket.emit("joinSession", { sessionId });
  });

  socket.on("sessionJoined", (data) => {
    console.log("[PLAYER 1] Joined session:", data.payload.sessionId);
  });

  socket.on("gamePaused", (data) => {
    console.log("[PLAYER 1] Game paused:", data);
  });
});
