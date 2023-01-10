'use strict';

import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv'; 
import fetch from 'node-fetch';
const __dirname = path.resolve(path.dirname(''));

dotenv.config()
// Constants
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const DOMAIN = 'https://api.astria.ai';
const API_KEY = process.env.API_KEY;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});


app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

app.get('/pool', async (req, res) => {
  res.status(200).send('OK');
});


app.post('/tune', async (req, res) => {
  let options = {
    method: 'POST',
    headers: { 
      "Authorization": "Bearer " + API_KEY,
      "Content-Type": "multipart/form-data",
    },
    body: JSON.stringify(req.body),
    redirect: 'follow'
  };
  console.log(req.body)

  res.send(await fetch(DOMAIN + '/tunes', options)
    .then(response => response.text())
    .then(result => result)
    .catch(error => error));
});


// working
app.get('/tunes', async(req, res) => {
  let options = {
    method: 'GET',
    headers: { "Authorization": "Bearer "+ API_KEY, "Content-Type": "application/json" },
    redirect: 'follow'
  };

  res.send(await fetch(DOMAIN + '/tunes', options)
    .then(response => response.text())
    .then(result => JSON.parse(result))
    .catch(error => error));
});

// working
app.get('/tunes/:id', async(req, res) => {
  let options = {
    method: 'GET',
    headers: { "Authorization": "Bearer "+ API_KEY, "Content-Type": "application/json" },
    redirect: 'follow'
  };

  res.send(await fetch(DOMAIN + `/tunes/${req.params.id}`, options)
    .then(response => response.text())
    .then(result => JSON.parse(result))
    .catch(error => error));
});

// working
app.get('/tunes/:id/prompts', async(req, res) => {
  let options = {
    method: 'GET',
    headers: { "Authorization": "Bearer "+ API_KEY, "Content-Type": "application/json" },
    redirect: 'follow'
  };

  res.send(await fetch(DOMAIN + `/tunes/291110/prompts/`, options)
    .then(response => response.text())
    .then(result => JSON.parse(result))
    .catch(error => error));
});


console.log(`'HTTP server started' on port ${PORT}`);

const server = app.listen(+PORT, HOST,()=>{});

function closeGracefully(signal) {
  server.close(() => {
    console.log(`'HTTP server closed'`)
  })
}

process.on('SIGTERM', closeGracefully)