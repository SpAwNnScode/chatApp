import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'querystring-es3';
import io from 'socket.io-client';
import '../style/chat.css';

let socket;

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, room } = queryString.parse(location.search.slice(1));
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);

  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize connection
  useEffect(() => {
    if (!name || !room) {
      navigate('/');
      return;
    }

    socket = io('http://localhost:5000');
    setConnected(true);

    // Handle connection error
    socket.on('connect_error', () => {
      setError('Failed to connect to server');
      setConnected(false);
    });

   
    socket.emit('join', { name, room });

    
    return () => {
      socket.disconnect();
      socket.off();
    }
  }, ['http://localhost:5000', name, room, navigate]);

  
  useEffect(() => {
    if (!socket) return;

    socket.on('message', message => {
      setMessages(messages => [...messages, message]);
      scrollToBottom();
    });

    socket.on('roomData', ({ users }) => {
      setUsers(users);
    });

    return () => {
      socket.off('message');
      socket.off('roomData');
    };
  }, []);

  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    
    if (message && connected) {
      socket.emit('sendMessage', message, (response) => {
        if (response && response.error) {
          setError(response.error);
        } else {
          setMessage('');
        }
      });
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('de-DE', { 
        hour: '2-digit', 
        minute: '2-digit', 
        timeZone: 'Europe/Berlin' 
    });
};

  const leaveRoom = () => {
    navigate('/');
  };

  return (
    <div className="chat-outer-container">
      <div className="chat-container">
        <div className="chat-header">
          <h1>Room: {room}</h1>
          <button className="leave-button" onClick={leaveRoom}>Leave Room</button>
        </div>
        
        <div className="chat-body">
          <div className="messages-container">
            {error && <div className="error-message">{error}</div>}
            
            <div className="messages">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`message ${msg.user === name ? 'my-message' : msg.user === 'admin' ? 'admin-message' : 'other-message'}`}
                >
                  <div className="message-header">
                    <span className="message-user">{msg.user === name ? 'You' : msg.user}</span>
                    <span className="message-time">{formatTime(msg.timestamp)}</span>
                  </div>
                  <div className="message-text">{msg.text}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <div className="users-container">
            <h2>Users</h2>
            <ul className="users-list">
              {users.map((user, index) => (
                <li key={index} className={user === name ? 'current-user' : ''}>
                  {user}{user === name ? ' (You)' : ''}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <form className="message-form" onSubmit={sendMessage}>
          <input 
            className="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            type="text"
            disabled={!connected}
          />
          <button 
            className="send-button" 
            type="submit"
            disabled={!message || !connected}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;