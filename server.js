'use strict';

import express from 'express';
import { Server } from 'socket.io';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
const __dirname = path.resolve(path.dirname(''));

dotenv.config()
// Constants
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use(express.static(__dirname + "/static/"));

app.get('/', async (req, res) => {
    //   res.sendFile(__dirname + '/static/index.html');
});


console.log(`'HTTP server started' on port ${PORT}`);

const httpServer = app.listen(+PORT, HOST, () => { });


const io = new Server(httpServer);

const activeUsers = new Set();

io.on("connection", function (socket) {
    console.log("Made socket connection");

    // await new myController().call();

    socket.on("disconnect", () => {
        console.log('disconnected', socket.id);
    });

    setTimeout(() => {
        console.log('sending data')
        socket.emit("server_data", socket.id);
    }, 3000);

    setTimeout(() => {
        socket.disconnect();
    }, 6000);


});


