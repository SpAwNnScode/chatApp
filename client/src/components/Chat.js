// Chat.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'querystring-es3';
import io from 'socket.io-client';

let socket;

const Chat = () => {
  const location = useLocation();
  const { name, room } = queryString.parse(location.search.slice(1)); // Remove the leading '?'

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const ENDPOINT = 'http://localhost:5000';

  useEffect(() => {
    socket = io(ENDPOINT);

    // Emit join event with user data
    socket.emit('join', { name, room });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
      socket.off();
    }
  }, [ENDPOINT, name, room]);

  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [...messages, message]);
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  return (
    <div className="chat-container">
      <h1>Room: {room}</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}: </strong>{msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          type="text"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
