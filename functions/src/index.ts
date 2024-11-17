const functions = require('firebase-functions');
const Razorpay = require('razorpay');
let key_id = 'REPLACEMENT_STRING_pJeAVOFICNZy8Z';
let key_secret = '8lF13eIkYM0quOSakjlnOxsI';
let request = require('request');
var whitelist = ['http://hoteltrivenisangam.com','https://hoteltrivenisangam.com','http://localhost:4200','https://localhost:4200'];
var corsOptions = {
  origin: function (origin:any, callback:any) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
const cors = require('cors')(corsOptions);
let instance = new Razorpay({
  key_id: key_id,
  key_secret: key_secret,
});

exports.createOrder = functions.https.onRequest((req: any, res: any) => {
  return cors(req, res, () => {
    console.log(req.body);
    let options = {
      amount: req.body.amount,
      currency: 'INR',
      receipt: req.body.receipt,
    };
    instance.orders.create(options, (err: any, order: any) => {
      order ? res.status(200).send(order) : res.status(500).send('Error');
    });
  });
});

exports.capturePayments = functions.https.onRequest((req: any, res: any) => {
  return cors(req, res, async () => {
    return await request( 
      {
        method: 'POST',
        url: `https://${key_id}:${key_secret}@api.razorpay.com/v1/payments/${req.body.payment_id}/capture`,
        form: {
          amount: req.body.amount,
        },
      },
      (error: any, response: any, body: any) => {
        response
          ? res.status(200).send({
              res: response,
              req: req.body,
              body: body,
            })
          : res.status(500).send('Error');
      }
    );
  });
});