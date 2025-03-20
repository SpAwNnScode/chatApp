import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
  res.send('Server is up and running.');
});

io.on('connection', (socket) => {
  console.log(`${socket.id} has connected`);

  socket.on('join', ({ name, room }) => {
    socket.join(room);

    // Send a welcome message to the user
    socket.emit('message', { user: 'admin', text: `Welcome ${name} to room ${room}`});
   
    // Notify others in the room
    socket.broadcast.to(room).emit('message', { user: 'admin', text: `${name} has joined!`});
  });

  socket.on('sendMessage', (message, callback) => {

    // Determine the room the sender is in
    const userRoom = Object.keys(socket.rooms).find(r => r !== socket.id);
    io.to(userRoom).emit('message', { user: 'user', text: message });
    callback();
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} has disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
