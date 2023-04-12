import cluster from "node:cluster"
import express from "express"
import http from 'http'
import cors from "cors"
import path from "path"
import os from "os"
import { Server } from "socket.io"
import { setupMaster, setupWorker } from "@socket.io/sticky"
import { createAdapter, setupPrimary } from "@socket.io/cluster-adapter"
// import { emit } from "process";
let numCPUs = os.cpus().length
const __dirname = path.resolve(path.dirname(''));

const PORT = 3001;
const HOST = '0.0.0.0';

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  // const app = express()

  const app = http.createServer();
  // setup sticky sessions
  setupMaster(app, {
    loadBalancingMethod: "least-connection",
  });

  // setup connections between the workers
  setupPrimary();
  // needed for packets containing buffers (you can ignore it if you only send plaintext objects)
  // Node.js > 16.0.0
  // cluster.setupPrimary({
  //   serialization: "advanced",
  // });

  // app.listen(PORT)

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    // cluster.fork();
  });

} else if (cluster.isWorker) {
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

  const httpServer = http.createServer(app);

  // const httpServer = http.createServer();
  console.log(`'HTTP server started' on port ${PORT}`);
  const server = app.listen(+PORT, HOST, () => { });

  app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
  });

  const io = new Server(httpServer,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    },
    // transports: ['websocket'],
    maxHttpBufferSize: 1e10,
    pingInterval: 10000, // 10 seconds
    pingTimeout: 60000, // 60 seconds
  })

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


