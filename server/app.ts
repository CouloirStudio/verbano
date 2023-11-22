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
import helmet from 'helmet';

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
    origin: ['https://localhost:3000/graphql', 'https://localhost:3000'],
    credentials: true,
  };
  app.use(cors(corsOptions));

  // Set Content Security Policy headers

  // Initialize passport and session
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(json());
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", 'https://localhost:3000'],
        mediaSrc: ['https://verbano-dev-audio.s3.us-west-2.amazonaws.com'],
      },
    }),
  );

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
