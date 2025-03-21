import express from 'express';
const router = express.Router();

let activeRooms = [];

router.get("/status", (req, res) => {
  res.status(200).json({ status: "Server is running" });
});

router.get("/rooms", (req, res) => {
  res.status(200).json({ rooms: activeRooms });
});

router.post("/rooms", (req, res) => {
  const { room } = req.body;
  
  if (!room) {
    return res.status(400).json({ error: "Room name is required" });
  }
  
  if (!activeRooms.includes(room)) {
    activeRooms.push(room);
  }
  
  res.status(201).json({ 
    message: "Room created successfully", 
    room 
  });
});

export default router;