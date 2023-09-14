// Import necessary modules and dependencies
import 'dotenv/config';
import express, {json} from 'express';
import next from 'next';
import cors from 'cors';
import http from 'http';

// Database connection setup
import {connectDB} from '../app/models/Database';

// Import GraphQL type definitions and resolvers
import typeDefs from '../app/schema/index';
import resolvers from '../app/resolvers/index';
import passport from "passport";
import {User} from "../app/models/User";
import {ExtractJwt, Strategy} from "passport-jwt";
import {ApolloServer} from "apollo-server-express";


// Server configuration
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev});
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
    context: ({req}) => {
      // Decode the user from the request
      const user = req.user || null;
      return {user};
    }
  });


  // User authentication

  // Passport JWT Strategy Configuration
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "CHANGE_ME_SECRET",
  };

  passport.use(new Strategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.userId);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  }));
  app.use(passport.initialize());


  // Ensure Apollo Server starts before integrating with Express
  await server.start();

  server.applyMiddleware({app})


  app.listen({port: 4000}, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
  });

  // Configure GraphQL route with authentication context
  // Protect all routes
  app.use('/graphql', passport.authenticate('jwt', {session: false}));


  // Handle all other requests using Next.js
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start HTTP server and log URLs once ready
  await new Promise<void>(resolve => httpServer.listen({port}, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  console.log(`> Next.js on http://localhost:${port}`);
}


// Start the server and handle potential errors
startApolloServer().catch(error => {
  console.error("Failed to start server:", error);
});
