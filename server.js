import cluster from "cluster"
import http from "http"
import { Server } from "socket.io"
import {cpus} from "os";
import { setupMaster, setupWorker } from "@socket.io/sticky"
import { createAdapter, setupPrimary }from "@socket.io/cluster-adapter"
// import { emit } from "process";
let numCPUs = cpus().length
if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  // const httpServer = http.createServer();

  // setup sticky sessions
  // setupMaster(httpServer, {
  //   loadBalancingMethod: "least-connection",
  // });

  // setup connections between the workers
  // setupPrimary();

  // // needed for packets containing buffers (you can ignore it if you only send plaintext objects)
  // // Node.js < 16.0.0
  // // cluster.setupPrimary({
  // //   serialization: "advanced",
  // // });
  // // Node.js > 16.0.0
  // cluster.setupPrimary({
  //   serialization: "advanced",
  // });

  // httpServer.listen(3000);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started`);

  const httpServer = http.createServer();
  const io = new Server(httpServer);

  // use the cluster adapter
  io.adapter(createAdapter());

  // setup connection with the primary process
  setupWorker(io);

  io.on("connection", (socket) => {
    socket.emit("working now")
  });
}