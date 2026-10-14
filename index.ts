import express from 'express';
import cors from 'cors';
import prisma from './prisma.ts';
import Stripe from 'stripe';

const app = express();
const PORT = Number(process.env.PORT ?? 5001);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const DOMAIN = 'http://localhost:4200'; 

// Enable CORS so the Angular app (running on a different port) can access this API
app.use(cors({
  origin: 'http://localhost:4200' // The Angular development server URL
}));

// Parse incoming JSON requests
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    message: 'Crafteez Marketplace API',
    endpoints: ['/api/data', '/api/products'],
  });
});

// Define a basic route
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the Node.js backend!' });
  console.log('Received request for /api/data');
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
    console.log('Fetched products:', products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
})

app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({

    ui_mode: "elements",
    line_items: [
      {
        // Provide the exact Price ID (for example, price_1234) of the product you want to sell
        price: "{{PRICE_ID}}",
        quantity: 1,
      },
    ],
    mode: 'payment',
    return_url: `${DOMAIN}/complete.html?session_id={CHECKOUT_SESSION_ID}`,
  });

  res.send({ clientSecret: session.client_secret });
});

app.get("/session-status", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id, {expand: ["payment_intent", "subscription"]});

   res.send({
    status: session.status,
    payment_status: session.payment_status,
    payment_intent_id: session.payment_intent?.id,
    payment_intent_status: session.payment_intent?.status,
    subscription_id: session.payment_intent ? null : session.subscription?.id,
    subscription_status: session.payment_intent ? null : session.subscription?.status
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
