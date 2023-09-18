// Import necessary modules and dependencies
import 'dotenv/config';
import express, {json} from 'express';
import next from 'next';
import cors from 'cors';
import http from 'http';


// Database connection setup
import {connectDB} from '../app/models/Database';

// Import GraphQL type definitions and resolvers
import typeDefs from '../app/schema/UserSchema';
import resolvers from '../app/resolvers/UserResolvers';
import passport from '../config/passport';
import {ApolloServer, Config, ExpressContext} from "apollo-server-express";
import session from "express-session";
import {buildContext} from "graphql-passport";
import {User} from "../app/models/User";
import {randomUUID} from "crypto";


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
  app.use(session({
    genid: (req) => randomUUID(),
    secret: "CHANGE_ME_SECRET",
    resave: false,
    saveUninitialized: false
  }))

  app.use(passport.initialize());
  app.use(passport.session());


  // Middleware setup: Enable CORS and handle JSON requests
  const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:4000/graphql", "https://studio.apollographql.com",],
    credentials: true,
  };
  app.use(cors(corsOptions));
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
    playground: {
      settings: {
        "request.credentials": "same-origin"
      }
    },
    context: ({req, res}) => buildContext({req, res, User}),
  } as Config<ExpressContext>);

  // Ensure Apollo Server starts before integrating with Express
  await server.start();

  server.applyMiddleware({app, cors: false})

  // Configure GraphQL route with authentication context
  // Protect all routes
  // app.use('/graphql', passport.authenticate('jwt', {session: false}));


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


