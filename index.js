const http = require('node:http');
const initializeSocketServer = require('./src/network/socketServer');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Briscas Multiplayer Server is running!\n');
});

// Initialize WebSocket server on top of the HTTP server
initializeSocketServer(server);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});