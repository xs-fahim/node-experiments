var log = (msg, ctx) => {
    ctx = ctx ?? '===';
    let messageBox = document.getElementById('message');
    messageBox.innerHTML += `${ctx}: ${msg}\n`;
};

var connectSocket = () => {
    const socket = io();

    socket.on('connect', () => {
        log(`Connected with socket id: ${socket.id}`, 'connection_status');
    });

    socket.on('server_message', (msg) => {
        log(`Received message from server: ${msg}`, 'server_message');
    });

    socket.on('disconnect', () => {
        log('Socket disconnected', 'connection_status');
    });

    socket.on('connect_error', (error) => {
        log(`Connection error: ${error.message}`, 'connection_status');
        socket.connect();
    });

    socket.on('reconnect_attempt', () => {
        log('Reconnecting...', 'connection_status');
    });
};

document.addEventListener('DOMContentLoaded', (event) => {
    connectSocket();
});