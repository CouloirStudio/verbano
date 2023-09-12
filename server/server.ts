import 'dotenv/config';
import express from 'express';
import next from 'next';
import { connectDB } from '../app/models/Database';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

// Connect to MongoDB
connectDB().then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

nextApp.prepare().then(() => {
  const app = express();

  app.all('*', (req, res) => {
    return handle(req, res);
  });

  app.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
