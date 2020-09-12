if (process.env.NODE_ENV !== 'production') {
  require('dotenv');
}
const fs = require('fs');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

const stripe = require('stripe')(stripeSecretKey);

const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

app.get('/store', (req, res) => {
  fs.readFile('items.json', (err, data) => {
    if (err) {
      res.status(500).end();
    } else {
      res.render('store.ejs', {
        stripePublicKey: stripePublicKey,
        items: JSON.parse(data),
      });
    }
  });
});

app.post('/purchase', (req, res) => {
  fs.readFile('items.json', (err, data) => {
    if (err) {
      res.status(500).end();
    } else {
      const itemsJson = JSON.parse(data);
      const watchesArray = itemsJson.watches;

      let total = 0;
      req.body.items.forEach((item) => {
        const itemJson = watchesArray.find(function (i) {
          return i.id == item.id;
        });
        total = total + itemJson.price * item.quantity;
      });
      console.log(total);

      stripe.charges
        .create({
          amount: total,
          source: process.env.STRIPE_SECRET_KEY,
          currency: 'usd',
        })
        .then(function () {
          console.log('success');
          res.status(200).send({ message: 'Successfully Purchased Items.' });
        })
        .catch(function () {
          console.log('failed');
          res.status(500).end();
        });
    }
  });
});

const port = process.env.PORT || 3000;
//listening to server port
app.listen(port, () => {
  console.log(`Server up and running on port ${port}`);
});
