// Import necessary modules and dependencies
import 'dotenv/config';
import express from 'express';
import next from 'next';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import { json } from 'express';

// Database connection setup
import { connectDB } from '../app/models/Database';

// Import GraphQL type definitions and resolvers
import typeDefs from '../app/schema/index';
import resolvers from '../app/resolvers/index';

// Server configuration
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

/**
 * Initializes and starts Apollo Server with Express and Next.js
 */
async function startApolloServer() {
  const app = express();

  // Middleware setup: Enable CORS and handle JSON requests
  app.use(cors());
  app.use(json());

  // Attempt MongoDB connection
  connectDB().then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

  await nextApp.prepare();

  // Create Apollo Server instance with associated plugins
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  // Ensure Apollo Server starts before integrating with Express
  await server.start();

  // Configure GraphQL route with authentication context
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: ({ req }) => {
        return Promise.resolve({ req, token: req.headers.token });
      }
    })
  );

  // Handle all other requests using Next.js
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start HTTP server and log URLs once ready
  await new Promise<void>(resolve => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  console.log(`> Next.js on http://localhost:${port}`);
}

// Start the server and handle potential errors
startApolloServer().catch(error => {
  console.error("Failed to start server:", error);
});
