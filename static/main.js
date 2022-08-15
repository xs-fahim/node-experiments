
var log = (mgs, ctx) => {
    ctx = ctx ?? '===';
    let messageBox = document.getElementById('message')
    messageBox.innerHTML += `${ctx}: ${mgs}` + "\n"
}

var connectSocket = () => {
    // const socket = io("http://localnode.test:3000?foo=bar");
    const socket = io();
    // client-side
    socket.on("connect", () => {
        log(socket.id, 'socket_id'); // x8WIv7-mJelg7on_ALbx
        log(socket.connected, 'connection_status'); // true

        socket.on("server_data", (arg) => {
            log(arg, 'server_data');
        });
    });

    socket.on("disconnect", () => {
        log('socket disconnected')
        log(socket.id, 'socket_id'); // undefined
        log(socket.connected, 'connection_status'); // false
    });

    // check if there is any problem with the connection, try to reconnect.
    // remember, every time, a new connection is stablished, the socket id is changed as well.
    socket.on("connect_error", () => {
        log('connect_error & reconnect');
        socket.connect();
    });

    // setTimeout(() => {
    //     socket.close(); // closing the connection from client side
    // }, 3000);

};