const stripe = require('stripe')(process.env.STRIPE_KEY);

const product = async () => {
    await stripe.products.create({
        name: 'Gravity Sass'
    });
}
console.log("product created", product)