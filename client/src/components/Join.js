import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../style/join.css';

export default function Join() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      setLoadingRooms(true);
      try {
        const response = await fetch('http://localhost:5000/rooms');
        const data = await response.json();
        setRooms(data.rooms || []);
        setError('');
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setError('Failed to load rooms from server');
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomChange = (event) => {
    setRoom(event.target.value);
  };

  const handleRoomSelection = (selectedRoom) => {
    setRoom(selectedRoom);
  };

  const validateInputs = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!room.trim()) {
      setError('Please enter or select a room');
      return false;
    }
    setError('');
    return true;
  };

  return (
    <div className="join-outer-container">
      <div className="join-inner-container">
        <h1 className="heading">Join Chat</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="input-group">
          <label htmlFor="name">Your Name</label>
          <input 
            id="name"
            placeholder="Enter your name..." 
            className="join-input" 
            type="text" 
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="room">Chat Room</label>
          <input 
            id="room"
            placeholder="Enter room name..." 
            className="join-input" 
            type="text" 
            onChange={handleRoomChange}
            value={room}
          />
        </div>
        
        {rooms.length > 0 && (
          <div className="rooms-container">
            <label>Or select an active room:</label>
            <div className="active-rooms">
              {rooms.map((activeRoom, index) => (
                <button 
                  key={index}
                  type="button"
                  className={`room-button ${room === activeRoom ? 'selected' : ''}`}
                  onClick={() => handleRoomSelection(activeRoom)}
                >
                  {activeRoom}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {loadingRooms && <div className="loading">Loading rooms...</div>}
        
        <Link 
          onClick={(e) => !validateInputs() ? e.preventDefault() : null} 
          to={`/chat?name=${name}&room=${room}`}
        >
          <button className="button" type="submit">Join Chat</button>
        </Link>
      </div>
    </div>
  );
}