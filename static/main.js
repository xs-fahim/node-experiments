
var log = (mgs, ctx) => {
    ctx = ctx ?? '===';
    let messageBox = document.getElementById('message')
    messageBox.innerHTML += `${ctx}: ${mgs}` + "\n"
}
// const socket = io("http://localhost:3000?foo=bar");

var connectSocket = () => {
    let keyword = "elementor addon"
    const socket = io(`http://localhost:3000`,{
        extraHeaders:{
            "Site-Token":"ST01-eyJjaXBoZXJ0ZXh0IjoiU0RMcEgxbDJPcW9FZzNFS0hrVmg4OVhsT3o4ZUw5MUEwdGtsdko2WFFjZzFESnNBOHp2MjN5Z3dONUU3QVZtT0k5ZDZRbitFUG1FQTFpcjNQQ2hLMkF0eTlsRFhkMU5PakZsMTJNanVVajlqN0VNRDZIak14T3FIZjV5U0NUYTRGUWtWYWYwb0l4bGJYZFUwanhDdHdxTytNb1FhRUFEUGVFeEx4TTFRVzF4aElJelB1Wndqd050dzNNUkE1eFBMNXVcL0RrRkdBVXhtZ2pBNW5PWlhJM2c9PSIsIml2IjoiNDQ2NDZkNTdmMTAyMDk3ZWNhOTZkMTU0M2VjNGM5YWMiLCJzYWx0IjoiODAzOTRhN2Q0MDk1MGVkOTcyYjE4OTQyNzNmZDU4ODkiLCJpdGVyYXRpb25zIjo5OTl9",
            "Auth-Token":"AT01-eyJjaXBoZXJ0ZXh0IjoiQjdMZVwvZWNxbHVYRUZSNkZQN3F2TmY5VFhKMDZxejNjRzJyeWFUVWw4ZEtcL0tHWUlhTmVNUnNNalVOdkt5SVlYZWFGVlF2U1d3NzkwdXZiNFhGb1A2dnFoVWRnY25LTVRPeGFqNWJMUThucGNMZTUxdHNseE9cLzZaKzZPSG1YbVlHZkZ5QXdacndkMFU2M0t5dVVQdFdvUDJEcXUxK3AyaUdDRHVjOHJ0MnBjPSIsIml2IjoiMjQ4MGJlZmI3ZThhZTU5Y2Q4ZGQwYTU2Yjg2NzhmZDAiLCJzYWx0IjoiMDY2NWVlNjllNzhhYTQ0ZDRhYWY2OWNmYzBhNGUyYjYiLCJpdGVyYXRpb25zIjo5OTl9"
        },
        query:{
            location:"US",
            keyword: "elementor addon"
        }
    });
    // client-side
    socket.on("connect", () => {
        log(socket.id, 'socket_id'); // x8WIv7-mJelg7on_ALbx
        log(socket.connected, 'connection_status'); // true

        socket.on("competitorData", (arg) => {
            console.log(arg, 'competitor');
        });
        socket.on("scrapedItems", (arg) => {
            log(arg, 'data');
            console.log(arg, 'data');
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