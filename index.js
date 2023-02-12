import cluster from "cluster";
import express from "express";
import path from "path";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import os from "os";
import { setupMaster, setupWorker } from "@socket.io/sticky";
import { createAdapter, setupPrimary } from "@socket.io/cluster-adapter";
const __dirname = path.resolve(path.dirname(''));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(express.static(__dirname + "/static/"));


const PORT = 3000;
const HOST = '0.0.0.0';

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  const __dirname = path.resolve(path.dirname(''));
  const httpServer = http.createServer();

  // setup sticky sessions
  setupMaster(httpServer, {
    loadBalancingMethod: "least-connection",
  });
  const CpuCores = os.cpus();
  console.log(`Total CPU cores: ${CpuCores.length} Speed: ${CpuCores[0].speed};}`)

  const osFreeMem = os.freemem();
  const allFreeMem = (osFreeMem / (1024 * 1024));
  const osTotalMem = os.totalmem();
  const avbMem = (osTotalMem / (1024 * 1024));

  console.log(`Total free memory: ${allFreeMem}MB`);
  console.log(`Total available RAM: ${avbMem}MB`);

  setupPrimary();

  // needed for packets containing buffers (you can ignore it if you only send plaintext objects)
  // Node.js > 16.0.0
  cluster.setupPrimary({
    serialization: "advanced",
  });

  httpServer.listen(PORT);
  // Count the machine's CPUs
  var cpuCount = os.cpus().length;

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
} else {
  console.log(`Worker ${process.pid} started`);

  app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
  });

  console.log(`'HTTP server started' on port ${PORT}`);
  const httpServer = app.listen(+0, HOST, () => { });
//   const ? = app.listen(+PORT, HOST, () => { });
  const io = new Server(httpServer);

  // use the cluster adapter
  io.adapter(createAdapter());

  // setup connection with the primary process
  setupWorker(io);

  io.on("connection", function (socket) {
    console.log("Made socket connection");

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

cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    // cluster.fork();
  });