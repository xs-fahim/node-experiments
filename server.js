'use strict';

import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv'; 
import fetch from 'node-fetch';
import multer from 'multer';
import FormData from 'form-data';
import fs from 'fs';
const __dirname = path.resolve(path.dirname(''));

dotenv.config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, './uploads/'))
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname.match(/\..*$/)[0])
  }
});

const multi_upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error('Only .png, .jpg and .jpeg format allowed!');
      err.name = 'ExtensionError';
      return cb(err);
    }
  },
}).array('uploadedImages', 4);

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
  let formData = new FormData();
  multi_upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      res.status(500).send({ error: { message: `Multer uploading error: ${err.message}` } }).end();
      return;
    } else if (err) {
      if (err.name == 'ExtensionError') res.status(413).send({ error: { message: err.message } }).end();
      else res.status(500).send({ error: { message: `unknown uploading error: ${err.message}` } }).end();
      return;
    }

    formData.append('tune[title]', req.body.title);
    // branch expect fast like openjourney2, sd15, sd21 for production
    formData.append('tune[branch]', 'openjourney2');

    // branch fast for development
    // formData.append('tune[branch]', 'fast');

    formData.append('tune[token]', 'zwx');
    formData.append('tune[name]', req.body.name);
    formData.append('tune[callback]', 'https://optional-callback-url.com/to-your-service-when-rady');

    req.files.forEach(file => {
      formData.append('tune[images][]', fs.createReadStream(`./uploads/${file.filename}`), file);
    });

    let options = {
      method: 'POST',
        headers: { 'Authorization': 'Bearer ' + API_KEY },
        body: formData
    };

    await fetch(DOMAIN + '/tunes', options)
    .then(async (r) => res.status(200).send(await r.json()))
    .catch(err => res.status(200).send(err));
  });
});

app.post('/tune/:id/prompt', async (req, res) => {
  let formData = new FormData();

  formData.append('prompt[text]', 'zwx hat holding in the hand of a women');
  formData.append('prompt[callback]', 'https://optional-callback-url.com/to-your-service-when-ready');

  let options = {
    method: 'POST',
      headers: { 'Authorization': 'Bearer ' + API_KEY },
      body: formData
  };

  return fetch(DOMAIN + `/tunes/${req.params.id}/prompts`, options)
    .then(async (r) => res.status(200).send(await r.json()))
    .catch(err => res.status(200).send(err));

});

app.get('/tunes', async(req, res) => {
  let options = {
    method: 'GET',
    headers: { "Authorization": "Bearer "+ API_KEY, "Content-Type": "application/json" },
    redirect: 'follow'
  };

  await fetch(DOMAIN + '/tunes', options)
    .then(response => response.text())
    .then(result => res.status(200).send(JSON.parse(result)))
    .catch(error => res.status(500).send(error));
});

app.get('/tune/:id', async(req, res) => {
  let options = {
    method: 'GET',
    headers: { "Authorization": "Bearer "+ API_KEY, "Content-Type": "application/json" },
    redirect: 'follow'
  };

  await fetch(DOMAIN + `/tunes/${req.params.id}`, options)
    .then(response => response.text())
    .then(result => res.status(200).send(JSON.parse(result)))
    .catch(error => res.status(500).send(error));
});

app.get('/tune/:id/prompt', async(req, res) => {
  let options = {
    method: 'GET',
    headers: { "Authorization": "Bearer "+ API_KEY, "Content-Type": "application/json" },
    redirect: 'follow'
  };

  await fetch(DOMAIN + `/tunes/${req.params.id}/prompts/`, options)
    .then(response => response.text())
    .then(result => res.status(200).send(JSON.parse(result)))
    .catch(error => res.status(500).send(error));
});


console.log(`'HTTP server started' on port ${PORT}`);

const server = app.listen(+PORT, HOST,()=>{});

function closeGracefully(signal) {
  server.close(() => {
    console.log(`'HTTP server closed'`)
  })
}

process.on('SIGTERM', closeGracefully)