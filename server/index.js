import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
//import router from './router'

const app = express();


const server = http.createServer(app);


const io = new Server(server);

app.get('/', (req, res) => {
  res.send('Hello, Socket.IO!');
});

io.on('connection', (socket) => {
  console.log(`${socket.id} has connected`);

  socket.on('disconnect', () => {
    console.log(`${socket.id} has disconnected`);
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
