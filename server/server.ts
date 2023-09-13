import 'dotenv/config';
import express from 'express';
import next from 'next';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import { json } from 'express';

import { connectDB } from '../app/models/Database';
// Importing your type definitions and resolvers
import typeDefs from '../app/schema/index';
import resolvers from '../app/resolvers/index';


const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

async function startApolloServer() {
  const app = express();

  // Enable cors and json middleware
  app.use(cors());
  app.use(json());

  // Connect to MongoDB
  connectDB().then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

  await nextApp.prepare();

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  // Ensure Apollo Server is started before using with express
  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        return Promise.resolve({ token: req.headers.token });
      }
    })
  );

  // Handle all other requests with Next.js
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  await new Promise<void>(resolve => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  console.log(`> Next.js on http://localhost:${port}`);
}

startApolloServer().catch(error => {
  console.error("Failed to start server:", error);
});
