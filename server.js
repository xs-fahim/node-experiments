'use strict';

import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import TestController1 from './testController1.js';
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


app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

app.get('/pool', async (req, res) => {
  res.status(200).send('OK');
});


app.post('/test1', (req, res) => {
  let initial = process.memoryUsage().heapUsed / 1024 / 1024
  console.log("working")
  //   new usageStats(req, res).getLimitUsage();
  new TestController1(req, res).run();
  let used = process.memoryUsage().heapUsed / 1024 / 1024
  let result = used-initial
  console.log(`memory total usage of the test 1 ${Math.round(used * 100) / 100} MB`)
  console.log(`memory usage of the test 1 ${Math.round(result * 100) / 100} MB`)
})

app.post('/test2', (req, res) => {
  let initial = process.memoryUsage().heapUsed / 1024 / 1024
  console.log("working")
  //   new usageStats(req, res).getLimitUsage();
  res.status(200).send(new TestController1(req, res).run());

  let used = process.memoryUsage().heapUsed / 1024 / 1024
  let result = used-initial
  console.log(`memory total usage of the test 2  ${Math.round(used * 100) / 100} MB`)
  console.log(`memory usage of the test 2  ${Math.round(result * 100) / 100} MB`)
})


console.log(`'HTTP server started' on port ${PORT}`);

const server = app.listen(+PORT, HOST, () => { });

function closeGracefully(signal) {
  server.close(() => {
    console.log(`'HTTP server closed'`)
  })
}

process.on('SIGTERM', closeGracefully)