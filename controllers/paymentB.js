const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "7zwbqv4zq4qnyqvh",
  publicKey: "tm895jw3dsz4fbqk",
  privateKey: "8802f298e16adff1a716e275f411cb60",
});

exports.getToken = (req, res) => {
    console.log('Talking with backend');
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      console.log('getToken err', err)
      res.status(500).send(err);
    } else {
      res.send(response);
    }
  });
};

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFromTheClient = req.body.amount
  gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    function (err, result) {
        if(err) {
            res.status(500).send(err)
        } else {
            res.json(result)
        }
    }
  );
};
