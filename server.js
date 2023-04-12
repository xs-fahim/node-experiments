var cluster = require('cluster');
var os = require('os');
const path = require('path');
const PORT = 3002;
// const __dirname = path.resolve(path.dirname(''));

if (cluster.isMaster) {
  console.log(`Master ${process.pid} started`)

  // we create a HTTP server, but we do not use listen
  // that way, we have a socket.io server that doesn't accept connections
  var server = require('http').createServer();
  var io = require('socket.io')(server);
  var redis = require('socket.io-redis');

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
  console.log(`Worker ${process.pid} started`)
  var express = require('express');
  var app = express();

  var http = require('http');
  var server = http.createServer(app);
  var io = require('socket.io')(server);
  var redis = require('socket.io-redis');
  app.use(express.static(__dirname + "/static/"));

  const httpServer = http.createServer(app);

  app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
  });

  io.adapter(redis({ host: 'localhost', port: 6379 }));
  io.on('connection', function(socket) {
    socket.emit('data', 'connected to worker: ' + cluster.worker.id);
  });

  console.log(`HTTP server listening on port ${PORT}`)
  app.listen(PORT);
}