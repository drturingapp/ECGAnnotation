// var express    = require('express');        // call express
// var app        = express();                 // define our app using express
// var bodyParser = require('body-parser');
//
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
//
// var router = express.Router();
//
// router.get('/', function(req, res, next) {
//
//     var amount = req.query.amount; // GET THE AMOUNT FROM THE GET REQUEST
//
//     var stripeToken = "CUSTOM_PAYMENT_TOKEN";
//
//     var charge = stripe.charges.create({
//         amount: 1100, // amount in cents, again
//         currency: "usd",
//         source: stripeToken,
//         description: "Example charge"
//     }, function(err, charge) {
//         if (err && err.type === 'StripeCardError') {
//             res.json(err);
//         } else {
//             res.json(charge);
//         }
//     });
// });