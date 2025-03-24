# Real-Time Chat Application
A real-time chat application built with React, Socket.io, Express, and MongoDB. Join rooms, chat with users, and see active participants in real-time. Messages and rooms persist in the database.

## Features
- **Join Chat Rooms**: Enter your name and choose/create a room.
- **Real-Time Messaging**: Instant message delivery with timestamps.
- **Message Persistence**: Messages inside the rooms and rooms are stored in MongoDB.
- **Active Users List**: See who's currently in the room.
- **Responsive Design**: Works on both desktop and mobile devices.
- **Room Management**: Automatic room cleanup when empty.

## Technologies Used
### Frontend:
- React
- React Router
- Socket.io Client
- CSS

### Backend:
- Express.js
- Socket.io
- MongoDB (Mongoose)
- CORS

## Installation
### Clone the repository:
```sh
git clone https://github.com/SpAwNnScode/chatApp.git
```

### Install dependencies
#### Client:
```sh
cd client
npm install
```

#### Server:
```sh
cd server
npm install
```

### Setup MongoDB
1. Install MongoDB and start the service.
2. Create a `.env` file in the `server` directory and add your MongoDB connection string:
   ```env
   MONGO_URI=mongodb://localhost:27017/chatApp
   ```

### Run the application
#### Start the server:
```sh
cd server
npm start
```

#### Start the client:
```sh
cd client
npm start
```

## Usage
### Home Page
- Enter your name.
- Choose or create a room.
- Click "Join Chat".

### Chat Interface
- Send messages in real-time.
- See active users in the chat and who joined or left.
- Receive admin messages for user activity.
- Messages are stored and persist in the room.
- Click "Leave Room" to exit.


