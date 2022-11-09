'use strict';
import test from "./test.js";
import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv'; 
const __dirname = path.resolve(path.dirname(''));
const results = require('./result.json')

dotenv.config()
// Constants
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
global.globalString = {
      name: "declared the variable",
    type: "string"
}
Object.freeze(globalString)
//console.log(globalString)
test()

app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

app.get('/pool', async (req, res) => {
  res.status(200).send('OK');
});


app.post('/test1', (req, res) => {
//   new usageStats(req, res).getLimitUsage();
})


console.log(`'HTTP server started' on port ${PORT}`);
console.log(results);

const server = app.listen(+PORT, HOST,()=>{});

function closeGracefully(signal) {
  server.close(() => {
    console.log(`'HTTP server closed'`)
  })
}

process.on('SIGTERM', closeGracefully)