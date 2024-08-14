import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:8080'); // Update the URL if your server runs on a different port

    socket.on('connect', () => {
      console.log('Socket.io connection established');
    });

    socket.on('server_message', (msg) => {
      console.log("🚀 ~ socket.on ~ msg:", msg)
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on('disconnect', () => {
      console.log('Socket.io connection closed');
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>WebSocket Demo</h1>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;