'use strict';

import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import ejs from 'ejs'
const __dirname = path.resolve(path.dirname(''));

dotenv.config()

const stripe = new Stripe(process.env.SECRET_KEY, {
  apiVersion: '2020-08-27',
});

// Constants
const PORT = process.env.PORT || 3002;
const HOST = '0.0.0.0';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});


app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

app.use(express.static(path.join(__dirname, './views')));

app.get('/pool', async (req, res) => {
  res.status(200).send('OK');
});


app.post('/stripe-payment', (req, res) => {
  try {
    stripe.customers
      .create({
        name: req.body.name,
        email: req.body.email,
        source: req.body.stripeToken
      })
      .then(customer =>
        stripe.charges.create({
          amount: req.body.amount * 100,
          currency: 'inr',
          customer: customer.id,
          description: req.body.description
        })
      )
      .then(() => res.render("completed.html"))
      .catch(err => console.log(err));
  } catch (err) {
    res.send(err);
  }
});

app.post('/webhook', app.use(express.raw({type: "*/*"})), function(req, res) {
  const sig = req.headers['stripe-signature'];
  const body = req.body;

  let event = null;

  console.log(sig)
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.ENDPOINT_SECRET);
  } catch (err) {
    // invalid signature
    console.log(err)
    res.status(400).end();
    return;
  }

  console.log(event)
  let intent = null;
  console.log(event['type'])

  // switch (event['type']) {
  //   // case 'payment_intent.succeeded':
  //   //   intent = event.data.object;
  //   //   console.log("Succeeded:", intent.id);
  //   //   break;
  //   // case 'payment_intent.payment_failed':
  //   //   intent = event.data.object;
  //   //   const message = intent.last_payment_error && intent.last_payment_error.message;
  //   //   console.log('Failed:', intent.id, message);
  //   //   break;
  // }

  res.sendStatus(200);
});


console.log(`'HTTP server started' on port ${PORT}`);

const server = app.listen(+PORT, HOST, () => { });

function closeGracefully(signal) {
  server.close(() => {
    console.log(`'HTTP server closed'`)
  })
}

process.on('SIGTERM', closeGracefully)