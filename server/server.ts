// Required imports
import 'dotenv/config';
import express from 'express';
import next from 'next';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import { json } from 'express';
import audioRoutes from '../app/routes/audioRoutes';

// Database connection
import { connectDB } from '../app/models/Database';

// GraphQL type definitions and resolvers
import typeDefs from '../app/schema/index';
import resolvers from '../app/resolvers/index';

// Server configuration
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

/**
 * Creates an Express app instance with the necessary middleware.
 * @returns The configured Express app instance.
 */
export function createApp() {
  const app = express();
  app.use(cors());
  app.use(json());
  app.use('/audio', audioRoutes);
  return app;
}

/**
 * Initializes and starts the Apollo Server with Express and Next.js.
 * @param app - The Express app instance to which the Apollo Server is attached.
 * @param testPort - Optional. For testing, it provides a dynamic port.
 * @returns - Returns the HTTP server instance.
 */
export async function startApolloServer(
  app: express.Express,
  testPort?: number,
): Promise<http.Server> {
  // MongoDB connection
  await connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err);
    });

  // Prepare Next.js app
  await nextApp.prepare();

  // Apollo Server setup
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  // Starting Apollo Server before Express integration
  await server.start();

  // Add GraphQL route with authentication context
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: ({ req }) => {
        return Promise.resolve({ req, token: req.headers.token });
      },
    }),
  );

  // Handle other requests with Next.js
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  const actualPort = testPort !== undefined ? testPort : port;

  // Start the HTTP server
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: actualPort }, resolve),
  );

  if (!testPort) {
    console.log(`🚀 Server ready at http://localhost:${actualPort}/graphql`);
    console.log(`> Next.js on http://localhost:${actualPort}`);
  }

  return httpServer;
}

// Initialize the app and start the server
const app = createApp();
startApolloServer(app).catch((error) => {
  console.error('Failed to start server:', error);
});
