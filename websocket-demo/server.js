require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('static'));

io.on('connection', (socket) => {
    console.log('New client connected');

    const intervalId = setInterval(() => {
        socket.emit('server_message', 'This is the message from server');
    }, 3000);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        clearInterval(intervalId);
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});