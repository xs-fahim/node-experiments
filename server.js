import cluster from "cluster"
import http from "http"
import express from "express"
import redis from 'socket.io-redis';
import fs from 'fs';
import cors from "cors"
import path from "path"
import os from "os"
import { Server } from "socket.io"
// import { Server } from "socket.io"
import {cpus} from "os";
import { setupMaster, setupWorker } from "@socket.io/sticky"
import { createAdapter, setupPrimary }from "@socket.io/cluster-adapter"
// import { emit } from "process";
let numCPUs = cpus().length
const __dirname = path.resolve(path.dirname(''));

const PORT = 3000;
const HOST = '0.0.0.0';

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);
  // setup sticky sessions
  // setupMaster(app, {
  //   loadBalancingMethod: "least-connection",
  // });

  // setup connections between the workers
  setupPrimary();
  // needed for packets containing buffers (you can ignore it if you only send plaintext objects)
  // Node.js < 16.0.0
  // cluster.setupPrimary({
  //   serialization: "advanced",
  // });
  // Node.js > 16.0.0
  cluster.setupPrimary({
    serialization: "advanced",
  });

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started`);
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(cors());
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });

  app.use(express.static(__dirname + "/static/"));

  // const httpServer = http.createServer();
  console.log(`'HTTP server started' on port ${PORT}`);
  const httpServer = app.listen(+PORT, HOST, () => { });

  app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
  });
  const io = new Server(httpServer, {transports: ['polling', 'websocket']});

  // use the cluster adapter
  io.adapter(createAdapter());

  // setup connection with the primary process
  setupWorker(io);

  
  io.on("connection", function (socket) {
    console.log("Made socket connection");
    console.log(socket.handshake.headers);

    // await new myController().call();

    socket.on("disconnect", () => {
      console.log('disconnected', socket.id);
    });

    // setTimeout(() => {
    //     console.log('sending data')
    //     socket.emit("server_data", socket.id);
    // }, 3000);

    // setTimeout(() => {
    //     socket.disconnect();
    // }, 6000);
  });
}

