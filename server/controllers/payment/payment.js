const endpointSecret =
  "whsec_69e67afff2fafb178407d087e0420f938a5607523bea1a8feed479efbbee336b";

const Ticket = require("../../models/Ticket");

const env = require("../../configs/envConfigs");
const stripe = require("stripe")(env.stripePrivateKey);

async function paymentStripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    console.log("Webhook verified");
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data.object;
      // Then define and call a function to handle the event checkout.session.completed
      await stripe.customers
        .retrieve(checkoutSessionCompleted.customer)
        .then(async (customer) => {
          //check is_paid = true in ticket
          await Ticket.findOneAndUpdate(
            { _id: customer.metadata.ticketId },
            {
              not_paid: false,
              payment_type: "Stripe",
              payment_intent: checkoutSessionCompleted.payment_intent,
              update_at: {
                update_time: Date.now(),
                update_content: "Payment success",
              },
            }
          );
        });
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // Return a 200 response to acknowledge receipt of the event
  res.send().end();
}

module.exports = {
  paymentStripeWebhook,
};
