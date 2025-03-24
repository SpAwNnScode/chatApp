import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router.js';
import Room from './models/Room.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatapp';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

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

  socket.on('join', async ({ name, room }) => {
    try {
      users[socket.id] = { name, room };
      socket.join(room);

      // Find or create room in MongoDB
      let roomDoc = await Room.findOne({ name: room });
      if (!roomDoc) {
        roomDoc = new Room({ name: room, activeUsers: [name] });
      } else {
        if (!roomDoc.activeUsers.includes(name)) {
          roomDoc.activeUsers.push(name);
        }
      }
      await roomDoc.save();

      const messages = roomDoc.messages.slice(-50);
      socket.emit('messageHistory', messages);

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

      io.to(room).emit('roomData', { 
        room, 
        users: roomDoc.activeUsers 
      });
    } catch (error) {
      console.error('Error in join event:', error);
    }
  });

  socket.on('sendMessage', async (message, callback) => {
    try {
      const userData = users[socket.id];
      
      if (!userData) {
        callback({ error: 'User not found' });
        return;
      }

      const newMessage = {
        user: userData.name,
        text: message,
        timestamp: new Date().toISOString()
      };

      await Room.findOneAndUpdate(
        { name: userData.room },
        { $push: { messages: newMessage } }
      );

      io.to(userData.room).emit('message', newMessage);
      callback();
    } catch (error) {
      console.error('Error in sendMessage:', error);
      callback({ error: 'Failed to send message' });
    }
  });

  socket.on('disconnect', async () => {
    const userData = users[socket.id];
    
    if (userData) {
      try {
        // Update active users in MongoDB
        await Room.findOneAndUpdate(
          { name: userData.room },
          { $pull: { activeUsers: userData.name } }
        );

        socket.broadcast.to(userData.room).emit('message', {
          user: 'admin',
          text: `${userData.name} has left the room`,
          timestamp: new Date().toISOString()
        });
        
        const roomDoc = await Room.findOne({ name: userData.room });
        
        io.to(userData.room).emit('roomData', { 
          room: userData.room, 
          users: roomDoc.activeUsers 
        });
        
        delete users[socket.id];
      } catch (error) {
        console.error('Error in disconnect:', error);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});