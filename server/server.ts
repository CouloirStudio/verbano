// Required imports
import 'dotenv/config';
import express, { json } from 'express';
import next from 'next';
import cors from 'cors';
import http from 'http';
// Database connection setup
import { connectDB } from '../app/models/Database';

// Import GraphQL type definitions and resolvers
import passport from '../config/passport';
import { ApolloServer, Config, ExpressContext } from 'apollo-server-express';
import session from 'express-session';
// import { buildContext } from 'graphql-passport';
import { randomUUID } from 'crypto';
import audioRoutes from '../app/routes/audioRoutes';
import { authenticateJWT } from '../app/middleware/auth';

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
  app.use(
    session({
      genid: (_req) => randomUUID(),
      secret: process.env.JWT_SECRET as string,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.get('/auth/google', passport.authenticate('google'));
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/login',
      failureMessage: true,
    }),
    function (req, res) {
      res.redirect('/');
    },
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Middleware setup: Enable CORS and handle JSON requests
  const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };
  app.use(cors(corsOptions));
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
    introspection: dev, // enable introspection in development
    playground: dev
      ? {
          settings: {
            'request.credentials': 'same-origin',
          },
        }
      : false,
    context: ({ req }) => {
      // Get the user from the request (set by passport after authentication)
      const user = req.user || null;

      // Use your JWT authentication function to decode and verify the token
      let jwtPayload = null;
      try {
        jwtPayload = authenticateJWT({ req });
      } catch (error) {
        if (typeof error === 'object' && error !== null && 'message' in error) {
          console.warn('JWT authentication failed:', error.message);
        }
      }

      return { user, jwtPayload };
    },
  } as Config<ExpressContext>);

  // Starting Apollo Server before Express integration
  await server.start();

  server.applyMiddleware({ app, cors: false });

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
