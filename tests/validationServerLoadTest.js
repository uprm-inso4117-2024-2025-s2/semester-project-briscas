// validationServerLoadTest.js

const { io } = require("socket.io-client");

const NUM_CLIENTS = 50;
const ACTIONS_PER_CLIENT = 20;
const SERVER_URL = "http://localhost:3000";

let validCount = 0;
let invalidCount = 0;
let totalLatency = 0;
let totalActions = 0;
let clientsReady = 0;
const clients = [];
let playerHands = [];

function logPerformance() {
  const avgLatency = totalActions ? totalLatency / totalActions : 0;
  const memory = process.memoryUsage();
  console.log("\nLoad Test Results:");
  console.log(`Total Actions: ${totalActions}`);
  console.log(`Valid Actions: ${validCount}`);
  console.log(`Invalid Actions: ${invalidCount}`);
  console.log(`Average Latency: ${avgLatency.toFixed(2)}ms`);
  console.log(`Memory Used: ${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  process.exit(0);
}

function simulateActions(socket, playerId, sessionId) {
  const hand = playerHands[playerId - 1] || [];

  for (let j = 0; j < ACTIONS_PER_CLIENT; j++) {
    const isValid = Math.random() > 0.3;
    const card =
      isValid && hand.length > 0
        ? hand[j % hand.length] // valid card
        : { suit: "FakeSuit", value: 99 }; // invalid card

    const start = Date.now();

    socket.emit("playerAction", {
      sessionId,
      playerId,
      card,
    });

    socket.once("gameUpdated", () => {
      const latency = Date.now() - start;
      validCount++;
      totalLatency += latency;
      totalActions++;
    });

    socket.once("actionError", () => {
      const latency = Date.now() - start;
      invalidCount++;
      totalLatency += latency;
      totalActions++;
    });
  }
}

function createClient(index, sessionId) {
  const socket = io(SERVER_URL, {
    transports: ["websocket"],
  });

  const playerId = index + 1;

  socket.on("connect", () => {
    socket.emit("joinSession", { sessionId, playerId });
  });

  socket.on("sessionJoined", () => {
    clients[index] = socket;
    clientsReady++;
    if (clientsReady === NUM_CLIENTS) {
      clients.forEach((clientSocket, i) => {
        simulateActions(clientSocket, i + 1, sessionId);
      });
      setTimeout(logPerformance, 12000);
    }
  });

  socket.on("error", (data) => {
    console.error(`Client ${playerId} error:`, data.message || data);
  });
}

function runTest() {
  const controlSocket = io(SERVER_URL);

  controlSocket.on("connect", () => {
    controlSocket.emit("createSession");

    controlSocket.on("sessionCreated", ({ payload }) => {
      const sessionId = payload.sessionId;
      console.log(`Session created: ${sessionId}`);

      controlSocket.emit("mockAttachGameState", { sessionId });

      controlSocket.on("mockGameStateAttached", ({ sessionId, hands }) => {
        playerHands = hands;
        console.log("Mock game setup done. Launching clients...");
        controlSocket.disconnect();
        for (let i = 0; i < NUM_CLIENTS; i++) {
          createClient(i, sessionId);
        }
      });
    });
  });

  controlSocket.on("error", (err) => {
    console.error("Failed to create session:", err);
  });
}

runTest();
