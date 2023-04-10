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
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf } }));
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
    let uniqueIdentifier = 123
    stripe.charges.create({
      amount: req.body.amount * 100,
      currency: 'usd',
      source: req.body.stripeToken,
      description: `${req.body.description} + ${uniqueIdentifier}`
    })
      .then(() => res.render("completed.html"))
      .catch(err => console.log(err));


    // stripe.customers
    //   .create({
    //     name: req.body.name,
    //     email: req.body.email,
    //     source: req.body.stripeToken
    //   })
    //   .then(customer =>
    //     stripe.charges.create({
    //       amount: req.body.amount * 100,
    //       currency: 'usd',
    //       customer: customer.id,
    //       description: req.body.description
    //     })
    //   )
    //   .then(() => res.render("completed.html"))
    //   .catch(err => console.log(err));
  } catch (err) {
    res.send(err);
  }
});

app.post('/stripe-webhooks', async (req, res) => {
  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      req.headers['stripe-signature'],
      process.env.STRIPE_SIGNING_SECRET
    );

    console.log(event)

    res.send(event);
  } catch (err) {
    console.log(err)
    res.send(err)
  }
});


console.log(`'HTTP server started' on port ${PORT}`);

const server = app.listen(+PORT, HOST, () => { });

function closeGracefully(signal) {
  server.close(() => {
    console.log(`'HTTP server closed'`)
  })
}

process.on('SIGTERM', closeGracefully)