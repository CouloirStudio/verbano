import 'dotenv/config';
import express, { json } from 'express';
import next from 'next';
import cors from 'cors';
import http from 'http';
import { connectDB } from '../app/models/Database';
import passport from '../app/config/passport';
import { ApolloServer, Config, ExpressContext } from 'apollo-server-express';
import session from 'express-session';
import { randomUUID } from 'crypto';
import audioRoutes from '../app/routes/audioRoutes';
import typeDefs from '../app/schema/index';
import resolvers from '../app/resolvers/index';
import { buildContext } from 'graphql-passport';
import { User } from '../app/models';
import { UserMutations } from '../app/resolvers/UserResolvers';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

export function createApp(mockMiddleware?: any) {
  const app = express();

  app.use(
    session({
      genid: (_req) => randomUUID(),
      secret: process.env.JWT_SECRET as string,
      resave: false,
      saveUninitialized: false,
    }),
  );

  const corsOptions = {
    origin: ['http://localhost:3000/graphql', 'http://localhost:3000'],
    credentials: true,
  };
  app.use(cors(corsOptions));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(json());

  // if test environment, use mock middleware
  if (process.env.NODE_ENV === 'test') {
    if (mockMiddleware) {
      app.use(mockMiddleware);
    }
    app.use('/auth-check', authCheckTestMiddleware);
  }

  app.get(
    '/auth/google',
    passport.authenticate('google', {
      prompt: 'select_account',
    }),
  );
  app.get(
    '/auth/google/callback',
    function (req, res, next) {
      passport.authenticate('google', function (err: any, user: any, info: any) {
        if (err) {
          return res.redirect('/login?error=' + encodeURIComponent(err.message));
        }
        if (!user) {
          return res.redirect('/login?error=' + encodeURIComponent(info.message));
        }
        req.logIn(user, function (err) {
          if (err) {
            return res.redirect('/login?error=' + encodeURIComponent(err.message));
          }
          return res.redirect('/');
        });
      })(req, res, next);
    }
  );
  app.get('/logout', handleLogout);

  app.use('/audio', audioRoutes);

  return app;
}

function isAuthenticated(req: any, res: any, next: any) {
  // If test environment, skip authentication
  if (process.env.NODE_ENV === 'test') {
    return next();
  }

  // If user is authenticated
  if (req.user) {
    // Prevent authenticated users from accessing /login or /register
    if (['/login', '/register'].includes(req.path)) {
      return res.redirect('/'); // Redirect to home or another suitable page
    }
    return next();
  }

  // Allow certain paths without authentication
  if (['/graphql'].includes(req.path) || req.path.startsWith('/_next')) {
    return next();
  }

  // If not authenticated and not already on /login or /register, redirect to /login
  if (!['/login', '/register'].includes(req.path)) {
    res.redirect('/login');
  } else {
    next(); // If already on /login or /register, continue without redirecting
  }
}

async function handleLogout(req: any, res: any) {
  try {
    const result = await UserMutations.logout(null, null, { req });
    if (result) {
      res.redirect('/');
    } else {
      res.status(500).send('Failed to logout');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error during logout');
  }
}

function authCheckTestMiddleware(req: any, res: any, next: any) {
  if (req.user) {
    res.status(200).send('Authenticated');
  } else {
    res.status(401).send('Unauthorized');
  }
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
    context: ({ req, res }) => buildContext({ req, res, User }),
  } as Config<ExpressContext>);

  await server.start();
  server.applyMiddleware({ app, cors: false });

  app.use(isAuthenticated);

  app.all('*', (req, res) => {
    return handle(req, res);
  });

  const actualPort = testPort !== undefined ? testPort : port;

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: actualPort }, resolve),
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
