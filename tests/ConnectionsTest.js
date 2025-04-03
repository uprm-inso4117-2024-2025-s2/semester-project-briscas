const {io} = require("socket.io-client");

const SERVER_URL = "ws://localhost:3000";

let sessionId = null;
let player1 = null;
let player2 = null;

function delay(ms) { return new Promise(res => setTimeout(res, ms)); }

async function startTest() {
  console.log("🧪 Starting test...");

  player1 = io(SERVER_URL);

  player1.on("connect", () => {
    console.log("[PLAYER 1] Connected:", player1.id);
    player1.emit("createSession");
  });

  player1.on("sessionCreated", (data) => {
    sessionId = data.payload.sessionId;
    console.log("[PLAYER 1] Created session:", sessionId);
    player1.emit("joinSession", {sessionId});
  });

  player1.on("sessionJoined", (data) => {
    console.log("[PLAYER 1] Joined session:", data.payload.sessionId);
    console.log("⏳ Waiting to connect Player 2...");
    setTimeout(connectPlayer2, 1000);
  });

  player1.on("gamePaused",
             (data) => { console.log("[PLAYER 1] ❗ Game Paused:", data); });

  player1.on("gameResumed",
             (data) => { console.log("[PLAYER 1] ✅ Game Resumed:", data); });
}

function connectPlayer2() {
  player2 = io(SERVER_URL);

  player2.on("connect", () => {
    console.log("[PLAYER 2] Connected:", player2.id);
    player2.emit("joinSession", {sessionId});
  });

  player2.on("sessionJoined", async (data) => {
    const playerId = data.payload.playerId;
    console.log(`[PLAYER 2] Joined session: ${
        data.payload.sessionId} as player ${playerId}`);
    player2.playerId = playerId;

    // Attach mock GameState to trigger pause/resume
    player1.emit("mockAttachGameState", {sessionId});

    console.log("⏱ Simulating disconnection in 2 seconds...");
    await delay(2000);

    console.log("[PLAYER 2] ❌ Simulating disconnect...");
    player2.disconnect();

    await delay(2000);
    reconnectPlayer2(playerId);
  });

  player2.on("gamePaused",
             (data) => { console.log("[PLAYER 2] ❗ Game Paused:", data); });

  player2.on("gameResumed",
             (data) => { console.log("[PLAYER 2] ✅ Game Resumed:", data); });
}

function reconnectPlayer2(playerId) {
  console.log("🔁 [PLAYER 2] Reconnecting with same playerId...");

  const player2Reconnect = io(SERVER_URL);

  player2Reconnect.on("connect", () => {
    console.log("[PLAYER 2] Reconnected:", player2Reconnect.id);
    player2Reconnect.emit("joinSession", {sessionId, playerId});
  });

  player2Reconnect.on(
      "sessionJoined",
      (data) => { console.log("[PLAYER 2] ✅ Successfully rejoined:", data); });

  player2Reconnect.on(
      "gameResumed",
      (data) => { console.log("[PLAYER 2] ✅ Game Resumed:", data); });

  player2Reconnect.on(
      "gamePaused",
      (data) => { console.log("[PLAYER 2] ❗ Game Paused:", data); });
}

// Start the full test sequence
startTest();
