if (process.env.NODE_ENV !== 'production') {
  require('dotenv');
}
const fs = require('fs');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

const express = require('express');
const app = express();

//EnterStripeMan098ChaChing

app.get('/store', (req, res) => {
  fs.readFile('items.json', (err, data) => {
    if (err) {
      res.status(500).end();
    } else {
      res.render('store.ejs', {
        items: JSON.parse(data),
      });
    }
  });
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.listen(5000);
