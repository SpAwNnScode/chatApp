import express from 'express';
import Room from './models/Room.js';

const router = express.Router();

router.get("/status", (req, res) => {
  res.status(200).json({ status: "Server is running" });
});

router.get("/rooms", async (req, res) => {
  try {
    const rooms = await Room.find({}, 'name');
    const roomNames = rooms.map(room => room.name);
    res.status(200).json({ rooms: roomNames });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

router.post("/rooms", async (req, res) => {
  const { room } = req.body;
  
  if (!room) {
    return res.status(400).json({ error: "Room name is required" });
  }
  
  try {
    let roomDoc = await Room.findOne({ name: room });
    
    if (!roomDoc) {
      roomDoc = new Room({ name: room });
      await roomDoc.save();
    }
    
    res.status(201).json({ 
      message: "Room created successfully", 
      room: roomDoc 
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create room" });
  }
});


export default router;