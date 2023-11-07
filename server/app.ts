import express, { json } from 'express';
import session from 'express-session';
import { randomUUID } from 'crypto';
import cors from 'cors';
import passport from '@/app/config/passport';
import next from 'next';
import routes from '@/app/routes';
import createGoogleAuthRoutes from '@/app/routes/googleOAuthRoutes';
import {
  authCheckTestMiddleware,
  handleLogout,
  isAuthenticated,
} from '@/app/middleware/auth';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });

const handle = nextApp.getRequestHandler();

/**
 * Creates an express app with the given mock middleware (if provided).
 * @param mockMiddleware - The mock middleware to use for testing (optional)
 */
export function createApp(mockMiddleware?: any) {
  const app = express();

  // Initialize session
  app.use(
    session({
      genid: (_req) => randomUUID(),
      secret: process.env.JWT_SECRET as string,
      resave: false,
      saveUninitialized: false,
    }),
  );

  // Allow cross-origin requests
  const corsOptions = {
    origin: ['http://localhost:3000/graphql', 'http://localhost:3000'],
    credentials: true,
  };
  app.use(cors(corsOptions));

  // Initialize passport and session
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

  // Google OAuth routes
  app.use(createGoogleAuthRoutes);

  app.get('/logout', handleLogout);

  // API endpoint routes
  app.use(routes);

  app.use(isAuthenticated);

  nextApp.prepare().then(() => {
    app.all('*', (req, res) => handle(req, res));
  });

  return app;
}

export default createApp;
