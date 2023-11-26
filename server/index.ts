/**
 * A WebSockets server which broadcasts received messages to connected clients.
 * Messages are sent to all clients other than the original sender.
 * 
 * Reference: https://github.com/websockets/ws#server-broadcast
 */

import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 4040 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data, isBinary) {
    // Log messages
    console.log('message rcvd:', data.toString())

    // Broadcast
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  })
})
