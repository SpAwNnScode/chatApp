import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import router from './router.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const users = {};

app.get('/', (req, res) => {
  res.send('Server is up and running.');
});

io.on('connection', (socket) => {
  console.log(`${socket.id} has connected`);

  socket.on('join', ({ name, room }) => {
    users[socket.id] = { name, room };
    socket.join(room);

    socket.emit('message', { 
      user: 'admin', 
      text: `Welcome ${name} to room ${room}`,
      timestamp: new Date().toISOString()
    });
   
    socket.broadcast.to(room).emit('message', { 
      user: 'admin', 
      text: `${name} has joined!`,
      timestamp: new Date().toISOString()
    });

    const roomUsers = Object.entries(users)
      .filter(([_, userData]) => userData.room === room)
      .map(([_, userData]) => userData.name);
    
    io.to(room).emit('roomData', { room, users: roomUsers });
  });

  socket.on('sendMessage', (message, callback) => {
    const userData = users[socket.id];
    
    if (!userData) {
      callback({ error: 'User not found' });
      return;
    }

    io.to(userData.room).emit('message', { 
      user: userData.name, 
      text: message,
      timestamp: new Date().toISOString()
    });
    
    callback();
  });

  socket.on('disconnect', () => {
    
    const userData = users[socket.id];
    if (userData) {
      socket.broadcast.to(userData.room).emit('message', {
        user: 'admin',
        text: `${userData.name} has left the room`,
        timestamp: new Date().toISOString()
      });
      
      const roomUsers = Object.entries(users)
        .filter(([id, data]) => data.room === userData.room && id !== socket.id)
        .map(([_, data]) => data.name);
      
      io.to(userData.room).emit('roomData', { 
        room: userData.room, 
        users: roomUsers 
      });
      
      delete users[socket.id];
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});