'use strict';
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
// const __dirname = path.resolve(path.dirname(''));

// dotenv.config()
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


app.get('/', async (req, res) => {
  res.sendFile(path.resolve(path.dirname('')) + '/static/index.html');
});

app.get('/pool', async (req, res) => {
  res.status(200).send('OK');
});


app.post('/test1', (req, res) => {
//   new usageStats(req, res).getLimitUsage();
})


console.log(`'HTTP server started' on port ${PORT}`);

const server = app.listen(+PORT, HOST,()=>{});

function closeGracefully(signal) {
  server.close(() => {
    console.log(`'HTTP server closed'`)
  })
}

process.on('SIGTERM', closeGracefully)