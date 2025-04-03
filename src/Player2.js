const {io} = require("socket.io-client");

const sessionId =
    "3cc9b839-eaf9-4d73-9a87-e677067fa6b6"; // Paste from Player 1's console

const socket = io("ws://localhost:3000");

socket.on("connect", () => {
  console.log("[PLAYER 2] Connected:", socket.id);

  socket.emit("joinSession", {sessionId});

  socket.on("sessionJoined", (data) => {
    console.log("[PLAYER 2] Joined session:", data.payload.sessionId);
  });

  socket.on("gamePaused",
            (data) => { console.log("[PLAYER 2] Game paused:", data); });
});
