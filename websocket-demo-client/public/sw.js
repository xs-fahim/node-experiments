let socket;

self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
    if (event.data === 'init') {
        if (!socket) {
            socket = new WebSocket('ws://localhost:8080');
            socket.onmessage = (message) => {
                self.clients.matchAll().then((clients) => {
                    clients.forEach((client) => {
                        client.postMessage(message.data);
                    });
                });
            };
        }
    }
});