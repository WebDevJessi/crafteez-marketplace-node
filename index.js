import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Enable CORS so the Angular app (running on a different port) can access this API
app.use(cors({
  origin: 'http://localhost:4200' // The Angular development server URL
}));

// Parse incoming JSON requests
app.use(express.json());

// Define a basic route
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the Node.js backend!' });
  console.log('Received request for /api/data');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
