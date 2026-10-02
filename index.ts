import express from 'express';
import cors from 'cors';
import prisma from './prisma.ts';

const app = express();
const PORT = Number(process.env.PORT ?? 5001);

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
