import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  messages: [{
    user: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
  }],
  activeUsers: [String]
});

export default mongoose.model('Room', roomSchema); 