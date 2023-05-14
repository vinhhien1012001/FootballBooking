const env = require("../configs/envConfigs");
const stripe = require("stripe")(env.stripePrivateKey);

// const storeItems = new Map([
//   [1, { priceInCents: 10000, name: "Learn React Today" }],
//   [2, { priceInCents: 20000, name: "Learn CSS Today" }],
// ]);
//
// const items = [
//   { id: 1, quantity: 3 },
//   { id: 2, quantity: 1 },
// ];

// "information_ticket": [
//        {
//            "pitch_id": "6437788f7fa3d436c5abd3ac",
//            "time": "2023-05-01T06:30:00.000+00:00",
//            "price": 80000
//        },
//        {
//            "pitch_id": "6437788f7fa3d436c5abd3ac",
//            "time": "2023-05-01T07:30:00.000+00:00",
//            "price": 80000
//        },
//        {
//            "pitch_id": "643778957fa3d436c5abd3b1",
//            "time": "2023-05-01T06:30:00.000+00:00",
//            "price": 80000
//        }
//    ],

async function stripePayment(ticketId, items) {
  try {
    console.log(ticketId);
    const customer = await stripe.customers.create({
      metadata: {
        ticketId: ticketId.toString(),
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer: customer.id,
      line_items: items.map((item) => {
        return {
          price_data: {
            currency: "vnd",
            product_data: {
              name: new Date(item.time).toUTCString(),
            },
            unit_amount: item.price,
          },
          quantity: 1,
        };
      }),
      success_url: `http://localhost:3000`,
      cancel_url: `http://localhost:3000`,
    });
    return {
      status: "Success",
      url: session.url,
    };
  } catch (e) {
    return {
      status: "Error",
      error: e,
    };
  }
}

async function refundPayment(payment_intent) {
  try {
    await stripe.refunds.create({
      payment_intent: payment_intent,
    });

    return "Success";
  } catch (error) {
    console.log(error);
    return `Error: ${error}`;
  }
}

module.exports = {
  stripePayment,
  refundPayment,
};
