import cluster from 'cluster';
import http from 'http'
import { Server } from 'socket.io'
import redis from 'socket.io-redis';
import express from 'express';
import os from 'os';
import path from 'path';

const __dirname = path.resolve(path.dirname(''));

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);
  // we create a HTTP server, but we do not use listen
  // that way, we have a socket.io server that doesn't accept connections
  var server = http.createServer();
  var io = new Server(server);

  io.adapter(redis({ host: 'localhost', port: 6379 }));

  setInterval(function() {
    // all workers will receive this in Redis, and emit
    io.emit('data', 'payload');
  }, 1000);

  for (var i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  }); 
}

if (cluster.isWorker) {
  console.log(`Worker ${process.pid} is running`);
  var app = express();

  app.use(express.static(__dirname + "/static/"));

  app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
  });

  var server = http.createServer(app);
  var io =new Server(server);

  io.adapter(redis({ host: 'localhost', port: 6379 }));
  io.on('connection', function(socket) {
    socket.emit('data', 'connected to worker: ' + cluster.worker.id);
  });

  console.log('HTTP server started on port 4000');
  app.listen(4000);
}