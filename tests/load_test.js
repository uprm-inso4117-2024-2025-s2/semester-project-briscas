// Load test script for server validation and resync under high concurrency
const { io } = require("socket.io-client");
const { performance } = require("perf_hooks");

const SERVER_URL = "http://localhost:3000";
const NUM_CLIENTS = 50; // Simulates 50 concurrent clients
const ACTIONS_PER_CLIENT = 20; // Each client sends 20 actions
let sharedSessionId;

// ----------------------
// SETUP TEST SESSION
// ----------------------
async function setupTestSession() {
  return new Promise((resolve, reject) => {
    const socket = io(SERVER_URL);

    socket.on("connect", () => {
      // Create a new session on the server
      socket.emit("createSession");
    });

    socket.on("sessionCreated", ({ payload }) => {
      sharedSessionId = payload.sessionId;

      // Attach a full mock GameState to ensure players have hands and turns
      socket.emit("fullMockGameState", {
        sessionId: sharedSessionId,
        numPlayers: NUM_CLIENTS,
      });

      socket.disconnect();
      resolve(sharedSessionId);
    });

    socket.on("connect_error", reject);
  });
}

// ----------------------
// SIMULATE CLIENT BEHAVIOR
// ----------------------
async function simulateClients(sessionId) {
  let totalActions = 0,
    validActions = 0,
    invalidActions = 0,
    latencies = [], // Measures validation delay
    resyncLatencies = [], // Measures resync response delay
    currentTurn = 1, // Track current server-side turn locally
    fakeHands = {}; // Local fake player hands for sending valid actions

  // Spawn NUM_CLIENTS simultaneous clients
  const clientPromises = Array.from({ length: NUM_CLIENTS }, (_, idx) => {
    const playerId = idx + 1;

    return new Promise((resolve) => {
      const socket = io(SERVER_URL);

      socket.on("connect", () => {
        // Each client joins the shared session
        socket.emit("joinSession", { sessionId, playerId });
      });

      socket.on("sessionJoined", () => {
        // After joining, set up a fake hand for sending valid card plays
        fakeHands[playerId] = [
          { id: `card-${playerId}-0`, rank: "2", suit: "swords" },
          { id: `card-${playerId}-1`, rank: "5", suit: "cups" },
          { id: `card-${playerId}-2`, rank: "king", suit: "coins" },
        ];

        let actionsSent = 0;

        // Interval to simulate rapid action sending
        const interval = setInterval(() => {
          if (actionsSent >= ACTIONS_PER_CLIENT) {
            clearInterval(interval);
            socket.disconnect();
            resolve(); // Done sending actions for this client
            return;
          }

          // Only allow sending if it's this player's turn
          if (currentTurn === playerId) {
            let action;

            // 80% of the time send a valid action; 20% invalid
            if (fakeHands[playerId].length && Math.random() > 0.2) {
              const card = fakeHands[playerId].shift();
              action = { type: "PLAY_CARD", cardId: card.id };
            } else {
              action = {
                type: "INVALID_ACTION",
                cardId: `invalid-${Math.random()}`,
              };
            }

            // Measure time to validate
            const start = performance.now();
            socket.emit("playerAction", action);
            latencies.push(performance.now() - start);

            // Randomly send resync requests to simulate desyncs (Task 2)
            if (Math.random() < 0.1) {
              const resyncStart = performance.now();
              socket.emit("resyncRequest");
              socket.once("resync", () => {
                resyncLatencies.push(performance.now() - resyncStart);
              });
            }

            actionsSent++;
            totalActions++;

            // Advance to next player's turn
            currentTurn = (currentTurn % NUM_CLIENTS) + 1;
          }
        }, 25); // Fast interval between actions
      });

      // Capture valid/invalid responses from the server
      socket.on("actionAccepted", () => validActions++);
      socket.on("error", () => invalidActions++);
    });
  });

  await Promise.all(clientPromises);

  // ----------------------
  // TEST RESULTS SUMMARY
  // ----------------------
  console.log("Load Test Summary:");
  console.log(`- Total Actions: ${totalActions}`); // Number of actions sent
  console.log(`- Valid Actions: ${validActions}`); // Server accepted valid actions
  console.log(`- Invalid Actions: ${invalidActions}`); // Server rejected invalid/malicious actions
  console.log(
    `- Avg Latency: ${(
      latencies.reduce((a, b) => a + b, 0) / latencies.length
    ).toFixed(2)} ms`
  ); // Action validation speed
  console.log(
    `- Avg Resync Latency: ${
      resyncLatencies.length
        ? (
            resyncLatencies.reduce((a, b) => a + b, 0) / resyncLatencies.length
          ).toFixed(2)
        : 0
    } ms`
  ); // Desync recovery speed
}

// ----------------------
// MAIN TEST RUNNER
// ----------------------
async function runTest() {
  console.log("Setting up test session...");
  const sessionId = await setupTestSession(); // Create session + mock state
  console.log(`Session ready: ${sessionId}\nStarting client simulation...`);

  await simulateClients(sessionId); // Run client load simulation
}

runTest().catch(console.error);
