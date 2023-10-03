import 'dotenv/config';
import express, {json} from 'express';
import next from 'next';
import cors from 'cors';
import http from 'http';
import {connectDB} from '../app/models/Database';
import passport from '../app/config/passport';
import {ApolloServer, Config, ExpressContext} from 'apollo-server-express';
import session from 'express-session';
import {randomUUID} from 'crypto';
import audioRoutes from '../app/routes/audioRoutes';
import typeDefs from '../app/schema/index';
import resolvers from '../app/resolvers/index';
import {buildContext} from 'graphql-passport';
import {User} from '../app/models';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev});
const handle = nextApp.getRequestHandler();

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

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/', function (req, res, next) {
    isAuthenticated(req, res, next);
  });

  app.get(
    '/auth/google',
    passport.authenticate('google', {
      prompt: 'select_account',
    }),
  );
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

  function isAuthenticated(req: any, res: any, next: any) {
    if (req.user) {
      return next();
    }
    res.redirect('/login');
  }


  const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };
  app.use(cors(corsOptions));
  app.use(json());
  app.use('/audio', audioRoutes);


  return app;
}

export async function startApolloServer(
  app: express.Express,
  testPort?: number,
): Promise<http.Server> {
  await connectDB()
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err);
    });

  await nextApp.prepare();

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: dev,
    playground: dev
      ? {
        settings: {
          'request.credentials': 'same-origin',
        },
      }
      : false,
    context: ({req, res}) => buildContext({req, res, User}),
  } as Config<ExpressContext>);

  await server.start();
  server.applyMiddleware({app, cors: false});

  app.all('*', (req, res) => {
    return handle(req, res);
  });

  const actualPort = testPort !== undefined ? testPort : port;

  await new Promise<void>((resolve) =>
    httpServer.listen({port: actualPort}, resolve),
  );

  if (!testPort) {
    console.log(`🚀 Server ready at http://localhost:${actualPort}/graphql`);
    console.log(`> Next.js on http://localhost:${actualPort}`);
  }

  return httpServer;
}

// Initialize and start the server only if NOT in a test environment
if (process.env.NODE_ENV !== 'test') {
  const app = createApp();
  startApolloServer(app).catch((error) => {
    console.error('Failed to start server:', error);
  });
}
