import express from 'express';
import cors from 'cors';
import prisma from './prisma.ts';
import Stripe from 'stripe';

const app = express();
const PORT = Number(process.env.PORT ?? 5001);
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:4200';

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error('PORT must be a valid port number');
}
if (!STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is required');
}
if (!STRIPE_PRICE_ID) {
  throw new Error('STRIPE_PRICE_ID environment variable is required');
}
if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
  throw new Error('FRONTEND_URL environment variable is required in production');
}

const stripe = new Stripe(STRIPE_SECRET_KEY);
const frontend = new URL(FRONTEND_URL);
if (!['http:', 'https:'].includes(frontend.protocol)) {
  throw new Error('FRONTEND_URL must use HTTP or HTTPS');
}
if (process.env.NODE_ENV === 'production' && frontend.protocol !== 'https:') {
  throw new Error('FRONTEND_URL must use HTTPS in production');
}
const frontendOrigin = frontend.origin;

app.use(cors({ origin: frontendOrigin }));

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

app.post('/create-checkout-session', async (_req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'elements',
      line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
      mode: 'payment',
      return_url: `${frontendOrigin}/complete.html?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

app.get('/session-status', async (req, res) => {
  const sessionId = req.query.session_id;
  if (typeof sessionId !== 'string' || sessionId.length === 0) {
    res.status(400).json({ error: 'A valid session_id is required' });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'subscription'],
    });

    res.json({
      status: session.status,
      payment_status: session.payment_status,
      payment_intent_id: session.payment_intent?.id,
      payment_intent_status: session.payment_intent?.status,
      subscription_id: session.payment_intent ? null : session.subscription?.id,
      subscription_status: session.payment_intent ? null : session.subscription?.status,
    });
  } catch (error) {
    console.error('Failed to retrieve checkout session:', error);
    res.status(500).json({ error: 'Failed to retrieve checkout session' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
