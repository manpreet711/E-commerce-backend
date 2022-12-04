const stripe = require("stripe")("sk_test_51KJIJXSJcDVVCwCFlsAcJYHdytL8DG6F5EcY4BE7A5HsvIyjsfLzxdl8IqqK885JndjZwPeTMzfy8i1CYTPCfwZC00g9Bqkf6O");
const { result } = require("lodash");
const uuid = require("uuid/v4");

exports.makePayment = (req, res) => {
  const { products, token } = req.body;
  console.log("Profucts", products);

  let amount = 0;
  products.map((p) => {
    amount = amount + p.price;
  });

  const idempotencyKey = uuid();

  return stripe.customers
    .create({
      email: token.emailsource,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
      // *100 coz stripe charge it in cents not in dollars
            amount: amount *100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description:"a test account",

            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip,
              },
            },
          },
          { idempotencyKey }
        )
        .then((result) => res.status(200).json(result))
        .catch((err) => console.log(err));
    });
};
