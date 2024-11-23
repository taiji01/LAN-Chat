import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const users = new Map();

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('join', ({ username, avatar }) => {
    users.set(socket.id, { username, avatar });
    io.emit('userJoined', { 
      username, 
      users: Array.from(users.values())
    });
  });

  socket.on('message', ({ message, avatar }) => {
    const user = users.get(socket.id);
    if (user) {
      io.emit('message', { 
        username: user.username,
        message,
        avatar
      });
    }
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      users.delete(socket.id);
      io.emit('userLeft', { 
        username: user.username,
        users: Array.from(users.values())
      });
    }
  });
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});